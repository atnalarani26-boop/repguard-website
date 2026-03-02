/**
 * 3D Reputation Monitoring Network
 * High-fidelity network visualization with nodes, links, and pulses.
 * Reference: https://xr.noomoagency.com/
 */

window.addEventListener('load', () => {
    const canvas = document.getElementById('nebula-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width, height;
    let mouse = { x: -1000, y: -1000 };
    let scrollY = window.scrollY;

    // Scan pulse properties
    let pulseRadius = 0;
    let isPulsing = false;

    // Network properties
    const nodes = [];
    const nodeCount = 60;
    const connectionDist = 180;

    const colors = {
        node: 'rgba(0, 240, 255, 0.8)',
        line: 'rgba(0, 240, 255, 0.15)',
        pulse: 'rgba(0, 240, 255, 0.4)',
        threatNode: 'rgba(255, 51, 102, 0.8)',
        threatLine: 'rgba(255, 51, 102, 0.2)'
    };

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('scroll', () => {
        scrollY = window.scrollY;
    });

    // Trigger pulse on click for "Intelligence Scan" feel
    window.addEventListener('mousedown', () => {
        pulseRadius = 0;
        isPulsing = true;
    });

    class Node {
        constructor() {
            this.init();
        }

        init() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            // Z-depth for parallax
            this.z = Math.random() * 0.5 + 0.5;
            this.radius = Math.random() * 2 + 1;
            this.vx = (Math.random() * 2 - 1) * 0.2;
            this.vy = (Math.random() * 2 - 1) * 0.2;
            this.isThreat = Math.random() > 0.9;
        }

        update() {
            // Ambient drift
            this.x += this.vx;
            this.y += this.vy;

            // Simple parallax relative to scroll
            const pX = 0;
            const pY = (scrollY * this.z * 0.1) % height;

            // Bounce / Wrap
            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
            if (this.y < 0) this.y = height;
            if (this.y > height) this.y = 0;
        }

        draw(offsetY) {
            const dy = (this.y + offsetY) % height;
            ctx.beginPath();
            ctx.arc(this.x, dy, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.isThreat ? colors.threatNode : colors.node;
            ctx.fill();

            // Node glow
            if (this.isThreat) {
                ctx.shadowBlur = 10;
                ctx.shadowColor = colors.threatNode;
            } else {
                ctx.shadowBlur = 5;
                ctx.shadowColor = colors.node;
            }
        }
    }

    for (let i = 0; i < nodeCount; i++) {
        nodes.push(new Node());
    }

    function drawConnections(offsetY) {
        ctx.shadowBlur = 0;
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const n1 = nodes[i];
                const n2 = nodes[j];
                const dy1 = (n1.y + offsetY) % height;
                const dy2 = (n2.y + offsetY) % height;

                const dx = n1.x - n2.x;
                const dy = dy1 - dy2;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < connectionDist) {
                    ctx.beginPath();
                    ctx.moveTo(n1.x, dy1);
                    ctx.lineTo(n2.x, dy2);
                    const opacity = 1 - (dist / connectionDist);
                    ctx.strokeStyle = n1.isThreat || n2.isThreat ? colors.threatLine : colors.line;
                    ctx.globalAlpha = opacity;
                    ctx.stroke();
                    ctx.globalAlpha = 1;
                }
            }
        }
    }

    function drawPulse() {
        if (!isPulsing) return;

        pulseRadius += 10;
        if (pulseRadius > Math.max(width, height)) {
            isPulsing = false;
            return;
        }

        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, pulseRadius, 0, Math.PI * 2);
        ctx.strokeStyle = colors.pulse;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 1 - (pulseRadius / Math.max(width, height));
        ctx.stroke();
        ctx.lineWidth = 1;
        ctx.globalAlpha = 1;
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, height);

        const offsetY = scrollY * 0.2;

        nodes.forEach(node => {
            node.update();
            node.draw(offsetY);
        });

        drawConnections(offsetY);
        drawPulse();

        // Mouse interaction: draw faint lines to mouse
        nodes.forEach(node => {
            const dy = (node.y + offsetY) % height;
            const dx = node.x - mouse.x;
            const distY = dy - mouse.y;
            const dist = Math.sqrt(dx * dx + distY * distY);
            if (dist < 200) {
                ctx.beginPath();
                ctx.moveTo(node.x, dy);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.strokeStyle = 'rgba(0, 240, 255, 0.1)';
                ctx.stroke();
            }
        });

        requestAnimationFrame(animate);
    }

    animate();
});
