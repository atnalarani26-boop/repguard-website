document.addEventListener('DOMContentLoaded', () => {
    // Select layers by ID
    const bg = document.getElementById('bg');
    const mid = document.getElementById('mid');
    const front = document.getElementById('front');
    const text = document.getElementById('text');

    // Smooth scrolling configuration
    let currentScrollY = 0;
    let targetScrollY = 0;
    
    // Low ease value = smoother but "draggier" feel
    // High ease value = snappier
    const ease = 0.08;

    // Track scroll events without blocking performance
    window.addEventListener('scroll', () => {
        targetScrollY = window.scrollY;
    }, { passive: true });

    // Custom Animation loop
    function animate() {
        // Linearly interpolate (lerp) from current to target
        // This causes the movement to gradually slow down to a stop, creating "smoothness"
        currentScrollY += (targetScrollY - currentScrollY) * ease;

        // Apply transformations based on scroll position
        
        // Background moves the slowest (downwards as we scroll down)
        if (bg) bg.style.transform = `translateY(${currentScrollY * 0.4}px)`;
        
        // Midground moves slightly faster
        if (mid) mid.style.transform = `translateY(${currentScrollY * 0.25}px)`;
        
        // Foreground usually stays put or moves upward faster than normal text to create extreme depth
        // We will move it up very slightly to enhance depth passing the normal content
        if (front) front.style.transform = `translateY(${currentScrollY * -0.15}px)`;
        
        // Text fades and moves down faster
        if (text) {
            text.style.transform = `translateY(${currentScrollY * 0.6}px)`;
            
            // Calculate opacity based on scroll threshold (so it fades out nicely)
            const opacity = Math.max(0, 1 - (currentScrollY / 500));
            text.style.opacity = opacity;
        }

        // Loop animation perpetually to catch all granular updates
        requestAnimationFrame(animate);
    }

    // Start animation loop
    animate();
});
