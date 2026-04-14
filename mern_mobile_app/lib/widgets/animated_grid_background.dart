import 'package:flutter/material.dart';

class AnimatedGridBackground extends StatefulWidget {
  final Widget child;
  final Color backgroundColor;
  final Color gridColor;

  const AnimatedGridBackground({
    super.key,
    required this.child,
    this.backgroundColor = Colors.white,
    this.gridColor = Colors.black,
  });

  @override
  State<AnimatedGridBackground> createState() => _AnimatedGridBackgroundState();
}

class _AnimatedGridBackgroundState extends State<AnimatedGridBackground>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    // 5s linear infinite to match your CSS 'drift 5s linear infinite'
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 5),
    )..repeat();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: widget.backgroundColor,
      body: AnimatedBuilder(
        animation: _controller,
        builder: (context, child) {
          return CustomPaint(
            painter: _GridPainter(
              progress: _controller.value,
              gridColor: widget.gridColor,
            ),
            child: SizedBox.expand(
              child: widget.child,
            ),
          );
        },
      ),
    );
  }
}

class _GridPainter extends CustomPainter {
  final double progress;
  final Color gridColor;

  _GridPainter({required this.progress, required this.gridColor});

  @override
  void paint(Canvas canvas, Size size) {
    final minorPaint = Paint()
      ..color = gridColor.withValues(alpha: 0.03) 
      ..strokeWidth = 1;

    final majorPaint = Paint()
      ..color = gridColor.withValues(alpha: 0.08)
      ..strokeWidth = 1;

    const double minorSize = 20.0;
    const double majorSize = 100.0;
    
    // Total drift distance
    double drift = progress * majorSize;

    // Draw Minor Grid (20px)
    for (double y = drift % minorSize - minorSize; y < size.height; y += minorSize) {
      canvas.drawLine(Offset(0, y), Offset(size.width, y), minorPaint);
    }
    for (double x = drift % minorSize - minorSize; x < size.width; x += minorSize) {
      canvas.drawLine(Offset(x, 0), Offset(x, size.height), minorPaint);
    }

    // Draw Major Grid (100px)
    for (double y = drift % majorSize - majorSize; y < size.height; y += majorSize) {
      canvas.drawLine(Offset(0, y), Offset(size.width, y), majorPaint);
    }
    for (double x = drift % majorSize - majorSize; x < size.width; x += majorSize) {
      canvas.drawLine(Offset(x, 0), Offset(x, size.height), majorPaint);
    }
  }

  @override
  bool shouldRepaint(_GridPainter oldDelegate) => oldDelegate.progress != progress;
}