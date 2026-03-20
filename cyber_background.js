/**
 * True 3D Reputation Monitoring Network (WebGL)
 * High-fidelity network visualization with nodes, links, and true camera parallax.
 * Powered by Three.js
 */

window.addEventListener('load', () => {
    const canvas = document.getElementById('nebula-canvas');
    if (!canvas || typeof THREE === "undefined") return;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.0015); // Deep darkness fading out

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.z = 200;

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // --- Particle Network Data ---
    const particleCount = 250;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const normalColor = new THREE.Color(0x00f0ff); // Cyan
    const threatColor = new THREE.Color(0xff3366); // Red/Pink

    // velocities for ambient drift
    const velocities = [];

    for (let i = 0; i < particleCount; i++) {
        // Spread particles in a wide, deep cylinder/tunnel shape
        const x = (Math.random() - 0.5) * 1200;
        const y = (Math.random() - 0.5) * 1200;
        const z = (Math.random() - 0.5) * 2000; // Deep Z spread

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        // ~15% chance of being a threat node
        const isThreat = Math.random() > 0.85;
        const pColor = isThreat ? threatColor : normalColor;
        
        colors[i * 3] = pColor.r;
        colors[i * 3 + 1] = pColor.g;
        colors[i * 3 + 2] = pColor.b;

        sizes[i] = Math.random() * 2.5 + 1.0;

        velocities.push({
            x: (Math.random() - 0.5) * 0.2,
            y: (Math.random() - 0.5) * 0.2,
            z: (Math.random() - 0.5) * 0.2
        });
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // --- Create Custom Shader Material for glowing dots ---
    const material = new THREE.PointsMaterial({
        size: 3.5,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.8,
        depthWrite: false
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // --- Create Lines (Connections) ---
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.15,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    // We use a dynamic buffer for lines that updates every frame based on distance
    const maxLineCount = particleCount * particleCount / 2; // worst case
    const linePositions = new Float32Array(maxLineCount * 3);
    const lineColors = new Float32Array(maxLineCount * 3);

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3).setUsage(THREE.DynamicDrawUsage));
    lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3).setUsage(THREE.DynamicDrawUsage));

    const linesMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(linesMesh);

    // --- Interaction State ---
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX - windowHalfX) * 0.05;
        mouseY = (e.clientY - windowHalfY) * 0.05;
    });

    let currentScroll = window.scrollY;
    let targetScroll = window.scrollY;

    window.addEventListener('scroll', () => {
        targetScroll = window.scrollY;
    });

    // --- Animation Loop ---
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        
        const delta = clock.getDelta();

        // Smooth scroll interpolation (lerp)
        currentScroll += (targetScroll - currentScroll) * 0.05;

        // Smooth mouse interpolation (lerp)
        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;

        // 1. Move camera through the tunnel based on scroll!
        // The further you scroll, the deeper you go into Z space
        camera.position.z = 200 - (currentScroll * 0.4);
        
        // 2. Add subtle camera rotation based on mouse
        camera.rotation.x = targetY * 0.005;
        camera.rotation.y = -targetX * 0.005;

        // 3. Update Particle Positions (ambient drift)
        const positions = particles.geometry.attributes.position.array;
        
        let vertexIndex = 0;
        let lineIndex = 0;

        for (let i = 0; i < particleCount; i++) {
            const v = velocities[i];
            
            // move
            positions[i * 3] += v.x;
            positions[i * 3 + 1] += v.y;
            positions[i * 3 + 2] += v.z;

            // wrap around boundaries gently to keep the volume full
            if (positions[i * 3] > 600) positions[i * 3] = -600;
            if (positions[i * 3] < -600) positions[i * 3] = 600;
            if (positions[i * 3 + 1] > 600) positions[i * 3 + 1] = -600;
            if (positions[i * 3 + 1] < -600) positions[i * 3 + 1] = 600;
            
            // Allow them to wrap deeply in Z so the camera always has stuff to fly through
            if (positions[i * 3 + 2] > 1000) positions[i * 3 + 2] = -1000;
            if (positions[i * 3 + 2] < -1000) positions[i * 3 + 2] = 1000;

            // 4. Calculate Distances for Lines
            for (let j = i + 1; j < particleCount; j++) {
                const dx = positions[i * 3] - positions[j * 3];
                const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
                const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
                const distSq = dx * dx + dy * dy + dz * dz;

                // If particles are close enough, draw a line
                if (distSq < 15000) { // approx 122 distance
                    // Start of line
                    linePositions[lineIndex++] = positions[i * 3];
                    linePositions[lineIndex++] = positions[i * 3 + 1];
                    linePositions[lineIndex++] = positions[i * 3 + 2];

                    // End of line
                    linePositions[lineIndex++] = positions[j * 3];
                    linePositions[lineIndex++] = positions[j * 3 + 1];
                    linePositions[lineIndex++] = positions[j * 3 + 2];
                }
            }
        }

        particles.geometry.attributes.position.needsUpdate = true;
        
        linesMesh.geometry.setDrawRange(0, lineIndex / 3);
        linesMesh.geometry.attributes.position.needsUpdate = true;

        // Render scene
        renderer.render(scene, camera);
    }

    // Handle Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Start loop
    animate();
});
