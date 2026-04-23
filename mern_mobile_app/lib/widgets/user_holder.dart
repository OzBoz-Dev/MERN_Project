import 'package:chip_in/models/user.dart';
import 'package:chip_in/widgets/user_container.dart';
import 'package:flutter/material.dart';

class UserHolder extends StatelessWidget {
  final List<User> users;
  final Function(User deletedUser)? onDelete;
  const UserHolder({super.key, required this.users, this.onDelete});

  @override
  Widget build(BuildContext context) {
    return Wrap(
      spacing: 6,
      runSpacing: 8,
      children: users.map((user) {
        final child = UserContainer(user: user,);
        // No interaction
        if (onDelete == null) {
          return child;
        }
        // Allow deletes otherwise
        // Passes the deleted tag up to the parent
        // Parent can look at this tag's label, then rebuild its TagHolder
        return GestureDetector(
          onTap: () {
            onDelete?.call(user);
          },
          child: child,
        );
      }).toList(),
    );
  }
}