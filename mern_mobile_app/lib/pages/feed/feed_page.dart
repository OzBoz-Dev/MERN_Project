import 'package:chip_in/models/post.dart';
import 'package:chip_in/models/tag.dart';
import 'package:chip_in/pages/projects/create_project_page.dart';
import 'package:chip_in/providers/auth_provider.dart';
import 'package:chip_in/providers/post_provider.dart';
import 'package:chip_in/services/content_service.dart';
import 'package:chip_in/widgets/animated_grid_background.dart';
import 'package:chip_in/widgets/tag_holder.dart';
import 'package:flutter/material.dart';
import 'package:chip_in/widgets/project_card.dart';
import 'package:flutter_tabler_icons/flutter_tabler_icons.dart';
import 'package:flutter_typeahead/flutter_typeahead.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';

class FeedPage extends StatefulWidget {
  const FeedPage({super.key});

  @override
  State<FeedPage> createState() => _FeedPageState();
}

class _FeedPageState extends State<FeedPage> {

  final ScrollController _scrollController = ScrollController();

  // For search
  final _searchController = TextEditingController();
  final List<Tag> _searchTags = [];
  String _searchQuery = "";
  DateTime? _searchStartDate;
  DateTime? _searchEndDate;

  // Used to control whether to show searched posts from provider
  bool _hasSearched = false;

  // Tells if we have any filters active
  bool get filtersActive => _searchQuery.isNotEmpty ||
    _searchTags.isNotEmpty ||
    (_searchStartDate != null &&
    _searchEndDate != null);

  // Post provider - will use to search
  late final PostProvider postProvider;

  // Shows dialog for advanced search
  Widget _buildAdvancedSearchDialog() {
    return Dialog(
      backgroundColor: Colors.white,
      insetPadding: EdgeInsets.all(8),
      child: StatefulBuilder(
        builder: (context, setDialogState) {
          return SingleChildScrollView(
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    "Filters",
                    textAlign: TextAlign.center,
                    style: GoogleFonts.montserrat(
                      fontSize: 18,
                      fontWeight: FontWeight.bold
                    ),
                  ),
                  const SizedBox(height: 24,),
                  Align(
                    alignment: Alignment.centerLeft,
                    child: Text("Search by Tag")
                  ),
                  const SizedBox(height: 12,),
                  TypeAheadField<Tag>(
                    itemBuilder: (context, Tag tag) {
                      return ListTile(
                        title: Text(tag.label),
                      );
                    },
                    onSelected: (tag) {
                      final alreadyExists = _searchTags.any((t) => t.label == tag.label);
                      if(alreadyExists) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text("Your profile already has this tag!"),
                          )
                        );
                      }
                      else {
                        setState(() {
                          _searchTags.add(tag);
                        });
                        setDialogState((){});
                      }
                    },
                    suggestionsCallback: (pattern) async {
                      if (pattern.isEmpty) return [];
                      final contentService = ContentService();
                      return await contentService.searchTagsByValue(pattern);
                    },
                    builder: (context, controller, focusNode) {
                      return TextField(
                        controller: controller,
                        focusNode: focusNode,
                        decoration: InputDecoration(
                          labelText: 'Search tags to add',
                          border: OutlineInputBorder(),
                        ),
                      );
                    },
                  ),
                  const SizedBox(height: 12,),
                  _searchTags.isEmpty ? Align(
                    alignment: Alignment.centerLeft,
                    child: Text("No tags")
                  ) : TagHolder(
                    tags: _searchTags,
                    onDelete: (deletedTag) {
                      setState(() {
                        _searchTags.remove(deletedTag);
                      });
                      setDialogState((){});
                    },
                  ),
                  const SizedBox(height: 24,),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: () async {
                        // No filters active - switch back to feed view
                        if(!filtersActive) {
                          setState(() {
                            _hasSearched = false;
                          });
                          return;
                        }
                        // Otherwise, switch to search view and carry out the search
                        setState(() {
                          _hasSearched = true;
                        });
                        // Search with given filters
                        await postProvider.searchPosts(_searchQuery, _searchTags, _searchStartDate, _searchEndDate, refresh: true);
                      },
                      child: Text("Apply Filters", style: GoogleFonts.montserrat(fontWeight: FontWeight.bold),),
                    ),
                  ),
                ],
              ),
            ),
          );
        }
      ),
    );
  }

  void _onScroll() {
    final authProvider = context.read<AuthProvider>();

    if (!_scrollController.hasClients) return;

    final thresholdReached =
        _scrollController.position.pixels >
        _scrollController.position.maxScrollExtent - 300;
    
    if(_searchQuery.isEmpty) {
      if (thresholdReached && postProvider.feedHasMore && !postProvider.isFeedLoading) {
        postProvider.loadFeed(authProvider.username!);
      }
    }
    else {
      if (thresholdReached && postProvider.searchHasMore && !postProvider.isSearchLoading) {
        postProvider.searchPosts(_searchQuery, _searchTags, _searchStartDate, _searchEndDate);
      }
    }
  }

  @override
  void initState() {
    super.initState();
    final authProvider = context.read<AuthProvider>();
    postProvider = context.read<PostProvider>();
    final username = authProvider.username!;
    // Get feed
    Future.microtask(() {
      context.read<PostProvider>().loadFeed(username);
    });
    _scrollController.addListener(_onScroll);
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<AuthProvider>(
      builder: (context, authProvider, child) {
        if(!authProvider.isAuthenticated) {
          return const Center(
            child: Text("You are not signed in."),
          );
        }
        else if(authProvider.isLoading) {
          return const Center(
            child: CircularProgressIndicator(),
          );
        }
        else if(authProvider.error != null) {
          return Center(
            child: Text(authProvider.error!),
          );
        }
        else {
          return Stack(
            children: [
              Consumer<PostProvider>(
                builder: (context, postProvider, child) {
                  // Get feed posts first to check the length
                  // Determine posts based on whether search query is not empty
                  List<Post> posts;
                  _hasSearched ? posts = postProvider.searchedPosts : posts = postProvider.feedPosts;
              
                  // Switch loading & error state based on search query
                  bool isLoading = _hasSearched ? postProvider.isSearchLoading : postProvider.isFeedLoading;
                  String? error = _hasSearched ? postProvider.searchError : postProvider.feedError;
              
                  if(isLoading && posts.isEmpty) {
                    return AnimatedGridBackground(
                      backgroundColor: const Color(0xFFFDF8EA),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            "Give us a moment...",
                            style: GoogleFonts.montserrat(
                              fontSize: 18
                            ),
                          ),
                          const SizedBox(height: 24,),
                          CircularProgressIndicator(
                            color: Color(0xFFFFA500),
                          ),
                        ],
                      ),
                    );
                  }
                  else if(error != null) {
                    return Center(
                      child: Text(error),
                    );
                  }
                  else if(posts.isEmpty && !isLoading) {
                    return AnimatedGridBackground(
                      backgroundColor: const Color(0xFFFDF8EA),
                      child: Padding(
                        padding: const EdgeInsets.all(14),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Icon(
                              TablerIcons.mood_confuzed,
                              color: Color(0xFFFFA500),
                              size: 48,
                            ),
                            const SizedBox(height: 12,),
                            Text(
                              textAlign: TextAlign.center,
                              _searchQuery.isEmpty ?
                              "No posts available!"
                              : "No results found...",
                              style: GoogleFonts.montserrat(
                                fontSize: 18,
                                fontWeight: FontWeight.w500
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  }
                  else {
                    return Stack(
                      children: [
                        GestureDetector(
                          onTap: () => FocusScope.of(context).unfocus(),
                          child: AnimatedGridBackground(
                            backgroundColor: const Color(0xFFFDF8EA),
                            child: ListView.builder(
                              controller: _scrollController,
                              padding: const EdgeInsets.only(top: 80, bottom: kToolbarHeight + 20,),
                              itemCount: posts.length + 1,
                              itemBuilder: (context, index) {
                                final provider = postProvider;
                          
                                final isLastItem = index == posts.length;
                          
                                if (isLastItem) {
                                  if (provider.feedHasMore) {
                                    return const Padding(
                                      padding: EdgeInsets.all(16),
                                      child: Center(child: CircularProgressIndicator(
                                        color: Color(0xFFFFA500)
                                      )),
                                    );
                                  } else {
                                    return Padding(
                                      padding: EdgeInsets.all(16),
                                      child: Center(
                                        child: Text(
                                          "You've reached the end!",
                                          style: GoogleFonts.montserrat(
                                            fontWeight: FontWeight.bold
                                          ),
                                        )
                                      ),
                                    );
                                  }
                                }
                                return Padding(
                                  padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 2),
                                  child: ProjectCard(post: posts[index]),
                                );
                              }
                            ),
                          ),
                        ),
                        Positioned(
                          left: 0,
                          right: 0,
                          bottom: 0,
                          child: SafeArea(
                            child: Container(
                              decoration: const BoxDecoration(
                                color: Colors.white,
                                boxShadow: [
                                  BoxShadow(
                                    blurRadius: 12,
                                    color: Colors.black12,
                                    offset: Offset(0, -2),
                                  )
                                ],
                              ),
                              child: Padding(
                                padding: const EdgeInsets.all(12),
                                child: Center(
                                  child: SizedBox(
                                    width: double.infinity,
                                    child: ElevatedButton.icon(
                                      onPressed: () {
                                        Navigator.of(context).push(
                                          MaterialPageRoute(
                                            builder: (context) => CreateProjectPage(),
                                          )
                                        );
                                      },
                                      icon: const Icon(TablerIcons.pencil),
                                      label: Text(
                                        "Create Project",
                                        style: GoogleFonts.montserrat(
                                          fontWeight: FontWeight.bold
                                        ),
                                      ),
                                    ),
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ),
                      ],
                    );
                  }
                },
              ),
              // Search bar
              Positioned(
                top: 0,
                left: 0,
                right: 0,
                child: SafeArea(
                  child: Container(
                    decoration: const BoxDecoration(
                      color: Colors.white,
                      boxShadow: [
                        BoxShadow(
                          blurRadius: 12,
                          color: Colors.black12,
                          offset: Offset(0, -2),
                        )
                      ],
                    ),
                    child: Padding(
                      padding: const EdgeInsets.all(12),
                      child: Center(
                        child: Row(
                          children: [
                            Expanded(
                              child: TextField(
                                controller: _searchController,
                                decoration: InputDecoration(
                                  hint: Text("Search for posts..."),
                                  suffixIcon: _searchController.text.isEmpty ? IconButton(
                                    onPressed: () async {
                                      // Collect query from search field
                                      final query = _searchController.text.trim();
                                      // If empty query, don't use it
                                      if(query.isEmpty) {
                                        return;
                                      }
                                      setState(() {
                                        _searchQuery = query;
                                        _hasSearched = true; // switch to search view
                                      });
                                      // Search with this query
                                      await postProvider.searchPosts(query, _searchTags, _searchStartDate, _searchEndDate, refresh: true);
                                    },
                                    icon: Icon(TablerIcons.search)
                                  )
                                  :
                                  IconButton(
                                    onPressed: () async {
                                      _searchController.clear();
                                      setState(() {
                                        // Clear search query
                                        _searchQuery = "";
                                      });

                                      // If after clearing the search query there are no more filters active,
                                      // we can switch back to normal feed view
                                      if(!filtersActive) {
                                        setState(() {
                                          _hasSearched = false;
                                        });
                                        return;
                                      }

                                      // Otherwise, we have to re-apply filters without the query
                                      await postProvider.searchPosts(_searchQuery, _searchTags, _searchStartDate, _searchEndDate, refresh: true);
                                    },
                                    icon: Icon(TablerIcons.x)
                                  )
                                ),
                              ),
                            ),
                            const SizedBox(width: 8,),
                            IconButton(
                              onPressed: () {
                                showDialog(
                                  context: context,
                                  builder: (context) => _buildAdvancedSearchDialog()
                                );
                              },
                              icon: Icon(
                                TablerIcons.adjustments,
                                size: 28,
                              )
                            )
                          ],
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ],
          );
        }
      },
    ); 
  }

  @override
  void dispose() {
    _scrollController.removeListener(_onScroll);
    _scrollController.dispose();
    _searchController.dispose();
    super.dispose();
  }
}