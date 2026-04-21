import 'package:chip_in/models/tag.dart';
import 'package:chip_in/providers/auth_provider.dart';
import 'package:chip_in/services/content_service.dart';
import 'package:chip_in/widgets/animated_grid_background.dart';
import 'package:chip_in/widgets/tag_holder.dart';
import 'package:flutter/material.dart';
import 'package:flutter_quill/flutter_quill.dart';
import 'package:flutter_tabler_icons/flutter_tabler_icons.dart';
import 'package:flutter_typeahead/flutter_typeahead.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:vsc_quill_delta_to_html/vsc_quill_delta_to_html.dart';

class CreateProjectPage extends StatefulWidget {
  const CreateProjectPage({super.key});

  @override
  State<CreateProjectPage> createState() => _CreateProjectPageState();
}

class _CreateProjectPageState extends State<CreateProjectPage> {

  final _titleController = TextEditingController();
  final _bodyController = QuillController.basic();
  final _editorFocusNode = FocusNode();

  // Tags to appear and edit in tag holder
  final List<Tag> _tags = [];

  // Whether user can post
  bool projectPostable() => _titleController.text.isNotEmpty && !_bodyController.document.isEmpty();

  @override
  void initState() {
    super.initState();
    _editorFocusNode.addListener(() {
      setState(() {});
    });
    _titleController.addListener(() {
      setState(() {});
    });
    _bodyController.addListener(() {
      setState(() {});
    });
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
    onTap: () => FocusScope.of(context).unfocus(),
    behavior: HitTestBehavior.opaque,
      child: Scaffold(
        appBar: AppBar(title: Text("Create Project"), centerTitle: true,),
        body: AnimatedGridBackground(
          backgroundColor: const Color(0xFFFDF8EA),
          child: SingleChildScrollView(
            child: Padding(
              padding: const EdgeInsets.all(8.0),
              child: Card(
                clipBehavior: Clip.antiAlias,
                child: Stack(
                  children: [
                    // left edge highlight
                    Positioned(
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: 8,
                      child: Container(
                        color: Color(0xFFffe082),
                      ),
                    ),
                    // Main content
                    Padding(
                      padding: const EdgeInsets.all(24),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Title
                          RichText(
                            text: TextSpan(
                              style: GoogleFonts.montserrat(
                                color: Colors.black,
                                fontSize: 18,
                                fontWeight: FontWeight.bold
                              ),
                              children: [
                                TextSpan(
                                  text: "Project Title ",
                                ),
                                TextSpan(
                                  text: "*",
                                  style: GoogleFonts.montserrat(
                                    color: Colors.red
                                  )
                                )
                              ]
                            ),
                          ),
                          const SizedBox(height: 8,),
                          TextField(
                            controller: _titleController,
                            maxLength: 50,
                            style: GoogleFonts.montserrat(
                              fontWeight: FontWeight.bold
                            ),
                            decoration: InputDecoration(
                              hint: Text(
                                "My Project Title",
                                style: GoogleFonts.montserrat(
                                  color: Colors.grey,
                                  fontWeight: FontWeight.bold
                                ),
                              ),
                              // hintStyle: GoogleFonts.montserrat(
                              //   fontWeight: FontWeight.bold
                              // )
                            ),
                          ),
                          const SizedBox(height: 4,),
                          // Tags
                          Text(
                            "Tags",
                            style: GoogleFonts.montserrat(
                              fontSize: 18,
                              fontWeight: FontWeight.bold
                            ),
                          ),
                          const SizedBox(height: 8,),
                          TypeAheadField<Tag>(
                            itemBuilder: (context, Tag tag) {
                              return ListTile(
                                title: Text(tag.label),
                              );
                            },
                            onSelected: (tag) {
                              final alreadyExists = _tags.any((t) => t.label == tag.label);
                              if(alreadyExists) {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(
                                    content: Text("Your profile already has this tag!"),
                                  )
                                );
                              }
                              else {
                                setState(() {
                                  _tags.add(tag);
                                });
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(
                                    content: Text("Tag added!"),
                                  )
                                );
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
                          _tags.isEmpty ? Text("No tags selected") : TagHolder(
                            tags: _tags,
                            onDelete: (deletedTag) {
                              setState(() {
                                _tags.remove(deletedTag);
                              });
                            },
                          ),
                          const SizedBox(height: 24,),
                          // Body
                          RichText(
                            text: TextSpan(
                              style: GoogleFonts.montserrat(
                                color: Colors.black,
                                fontSize: 18,
                                fontWeight: FontWeight.bold
                              ),
                              children: [
                                TextSpan(
                                  text: "Description ",
                                ),
                                TextSpan(
                                  text: "*",
                                  style: GoogleFonts.montserrat(
                                    color: Colors.red
                                  )
                                )
                              ]
                            ),
                          ),
                          const SizedBox(height: 8,),
                          QuillSimpleToolbar(
                            controller: _bodyController,
                            config: QuillSimpleToolbarConfig(
                              multiRowsDisplay: false,
                              showFontSize: false,
                              showFontFamily: false,
                              showColorButton: false,
                              showBackgroundColorButton: false,
                              showSuperscript: false,
                              showSubscript: false,
                              showListCheck: false,
                              showIndent: false,
                              showSearchButton: false,
                              showBoldButton: true,
                              showItalicButton: true,
                              showUnderLineButton: true,
                              showStrikeThrough: true,
                              showListNumbers: true,
                              showListBullets: true,
                              showCodeBlock: false,
                              buttonOptions: QuillSimpleToolbarButtonOptions(
                                base: QuillToolbarBaseButtonOptions(
                                  iconTheme: const QuillIconTheme(
                                    iconButtonUnselectedData: IconButtonData(
                                      color: Colors.black
                                    ),
                                    iconButtonSelectedData: IconButtonData(
                                      color: Color(0xFFFFA500)
                                    )
                                  ),
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(height: 12,),
                          Container(
                            height: 300,
                            decoration: BoxDecoration(
                              color: Color(0xFFFDF8EA),
                              borderRadius: BorderRadius.circular(3),
                              border: Border.all(
                                 color: _editorFocusNode.hasFocus
                                  ? const Color(0xFFFFA500)
                                  : Colors.grey[300]!,
                              )
                            ),
                            child: QuillEditor.basic(
                              controller: _bodyController,
                              focusNode: _editorFocusNode,
                              config: QuillEditorConfig(
                                disableClipboard: true,
                                customStyles: DefaultStyles(
                                  paragraph: DefaultTextBlockStyle(
                                    GoogleFonts.montserrat(
                                      fontSize: 16,
                                      color: Colors.black,
                                    ),
                                    const HorizontalSpacing(0, 0), // Space before/after paragraph
                                    const VerticalSpacing(0, 0),
                                    const VerticalSpacing(0, 0),
                                    null
                                  ),
                                  bold: GoogleFonts.montserrat(
                                    fontSize: 16,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.black
                                  ),
                                  inlineCode: InlineCodeStyle(
                                    style: GoogleFonts.robotoMono(
                                      fontSize: 16,
                                      color: Colors.black,
                                    ),
                                  ),
                                ),
                                padding: EdgeInsets.symmetric(horizontal: 12, vertical: 16),
                              ),
                            ),
                          ),
                          const SizedBox(height: 24,),
                          SizedBox(
                          width: double.infinity,
                          child: ElevatedButton.icon(
                            onPressed: projectPostable() ? () async {
                              // Get title
                              final title = _titleController.text.trim();

                              // Get tags
                              final tags = _tags.map((tag) => tag.label).toList();

                              // Convert body to html
                              final converter = QuillDeltaToHtmlConverter(
                                _bodyController.document.toDelta().toJson(),
                              );
                              final bodyHtml = converter.convert();

                              // Post to backend
                              final contentService = ContentService();
                              final authProvider = context.read<AuthProvider>();
                              final token = authProvider.token!;

                              // Show loading dialog
                              showDialog(
                                context: context,
                                barrierDismissible: false,
                                builder: (context) {
                                  return AlertDialog(
                                    content: Padding(
                                      padding: const EdgeInsets.symmetric(vertical: 12),
                                      child: Column(
                                        mainAxisSize: MainAxisSize.min,
                                        crossAxisAlignment: CrossAxisAlignment.center,
                                        children: [
                                          Text(
                                            "Posting your project...",
                                            style: GoogleFonts.montserrat(
                                              fontSize: 18
                                            ),
                                          ),
                                          const SizedBox(height: 16),
                                          CircularProgressIndicator(color: Color(0xFFFFA500)),
                                        ],
                                      ),
                                    ),
                                  );
                                }
                              );

                              try{
                                // Post the project
                                await contentService.createPost(
                                  token,
                                  title,
                                  bodyHtml,
                                  tags
                                );
                                // Hide loading after post
                                if(mounted) Navigator.of(context, rootNavigator: true).pop();
                                // Show success
                                showDialog(
                                  context: context,
                                  barrierDismissible: true,
                                  builder: (context) {
                                    return AlertDialog(
                                      content: Padding(
                                        padding: const EdgeInsets.symmetric(vertical: 12),
                                        child: Column(
                                          mainAxisSize: MainAxisSize.min,
                                          crossAxisAlignment: CrossAxisAlignment.center,
                                          children: [
                                            Text(
                                              "Project Posted!",
                                              style: GoogleFonts.montserrat(
                                                fontSize: 18
                                              ),
                                            ),
                                            const SizedBox(height: 16),
                                            Icon(
                                              TablerIcons.circle_check,
                                              color: const Color(0xFFFFA500),
                                              size: 48,
                                            )
                                          ],
                                        ),
                                      ),
                                    );
                                  }
                                );
                              }
                              catch(e) {
                                // Hide loading on error
                                if(mounted) Navigator.of(context).pop();
                                if(mounted) {
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    SnackBar(
                                      content: Text(e.toString()),
                                    )
                                  );
                                }
                              }

                            } : null,
                            icon: Icon(TablerIcons.rocket),
                            label: Text("Post Project", style: GoogleFonts.montserrat(fontWeight: FontWeight.bold),),
                          ),
                        ),
                        ],
                      ),
                    ),
                  ]
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  @override
  void dispose() {
    _titleController.dispose();
    _bodyController.dispose();
    _editorFocusNode.dispose();
    super.dispose();
  }
}