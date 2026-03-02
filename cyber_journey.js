// ================================================================
// RepGuard – Full Parallax Experience
// GSAP + ScrollTrigger + Lenis | Desktop & Mobile Responsive
// ================================================================
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {

    // ── Device Detection ─────────────────────────────────────────
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ── Smooth Scroll (Lenis) – Desktop only ──────────────────────
    let lenis;
    if (!isMobile && !prefersReduced) {
        lenis = new Lenis({
            duration: 1.1,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: "vertical",
            smoothWheel: true,
            wheelMultiplier: 0.9,
            smoothTouch: false,
            infinite: false,
        });

        lenis.on("scroll", ScrollTrigger.update);

        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
    }

    // ── matchMedia Switcher ───────────────────────────────────────
    const mm = gsap.matchMedia();

    // ================================================================
    //  SHARED: Navbar hide/show on scroll
    // ================================================================
    const navbar = document.querySelector(".navbar");
    let lastScrollY = window.scrollY;
    window.addEventListener("scroll", () => {
        const current = window.scrollY;
        if (current > lastScrollY && current > 80) {
            navbar?.classList.add("nav-hidden");
        } else {
            navbar?.classList.remove("nav-hidden");
        }
        lastScrollY = current;
    }, { passive: true });

    // ================================================================
    //  SHARED: Word-reveal entrance (runs on all devices)
    // ================================================================
    if (!prefersReduced) {
        gsap.from(".word-reveal", {
            y: 60,
            opacity: 0,
            rotateX: -40,
            stagger: 0.07,
            duration: 1.6,
            ease: "expo.out",
            delay: 0.3,
        });
    }

    // ================================================================
    //  DESKTOP ANIMATIONS (≥ 769px)
    // ================================================================
    mm.add("(min-width: 769px)", () => {

        // ── SCENE 1: Hero – pinned multi-layer parallax ──────────
        const introTl = gsap.timeline({
            scrollTrigger: {
                trigger: "#scene-intro",
                start: "top top",
                end: "+=1400",
                pin: true,
                scrub: 1,
                anticipatePin: 1,
            },
        });

        // Personas float in on page load
        gsap.utils.toArray(".persona-img").forEach((img, i) => {
            gsap.fromTo(img,
                { y: 100, opacity: 0, rotateY: i % 2 === 0 ? 30 : -30 },
                { y: 0, opacity: 0.88, rotateY: 0, duration: 1.6, ease: "expo.out", delay: 0.5 + i * 0.5 }
            );
            // Lazy float after entrance
            gsap.to(img, {
                y: "random(-20, 20)", x: "random(-6, 6)", rotationZ: "random(-3, 3)",
                duration: "random(4, 7)", repeat: -1, yoyo: true, ease: "sine.inOut",
                delay: 0.5 + i * 0.5 + 1.8,
            });
        });

        // Logo floating
        gsap.to(".massive-logo", {
            y: "random(-14, 14)", rotationY: "random(-8, 8)",
            duration: "random(3, 5)", repeat: -1, yoyo: true, ease: "sine.inOut"
        });

        // Scroll-driven: text blasts toward camera, personas exit
        introTl
            .to(".back-layer", { z: -200, scale: 1.08, x: -80, opacity: 0.05 }, 0)
            .to(".marquee-track", { xPercent: -80, ease: "none" }, 0)
            .to(".word-reveal", { opacity: 0, scale: 0.6, z: 600, stagger: 0.02, y: -120 }, 0)
            .to(".massive-logo", { scale: 3.5, y: -280, opacity: 0, ease: "power2.in" }, 0.05)
            .to(".persona-img", { y: -120, opacity: 0, stagger: 0.05, ease: "power2.in" }, 0.1)
            .to(".scroll-down", { opacity: 0, y: -30 }, 0);

        // ── Narrative Transition ─────────────────────────────────
        gsap.fromTo(".scroll-narrative-text",
            { opacity: 0, y: 80, scale: 0.92 },
            {
                opacity: 1, y: 0, scale: 1,
                scrollTrigger: {
                    trigger: ".narrative-transition--short",
                    start: "top 80%", end: "center 35%", scrub: 1.2,
                }
            }
        );
        gsap.to(".scroll-narrative-text", {
            opacity: 0, y: -80, scale: 1.08,
            scrollTrigger: {
                trigger: ".narrative-transition--short",
                start: "center 40%", end: "bottom top", scrub: 1.2,
            }
        });

        // ── SCENE 2: Threats ─────────────────────────────────────
        gsap.fromTo("#scene-threats .headline-large",
            { y: 100, opacity: 0 },
            {
                y: 0, opacity: 1,
                scrollTrigger: {
                    trigger: "#scene-threats",
                    start: "top 85%", end: "top 35%", scrub: 1.2,
                }
            }
        );

        gsap.utils.toArray(".threat-card").forEach((card, i) => {
            gsap.fromTo(card,
                { y: 180 + i * 40, opacity: 0, rotateZ: (i % 2 === 0 ? -3 : 3) },
                {
                    y: 0, opacity: 1, rotateZ: 0,
                    scrollTrigger: {
                        trigger: "#scene-threats",
                        start: "top 80%", end: "center 30%",
                        scrub: 0.8 + i * 0.3,
                    }
                }
            );
        });

        gsap.to(".threat-bg", {
            y: -120, x: -60,
            scrollTrigger: {
                trigger: "#scene-threats",
                start: "top bottom", end: "bottom top",
                scrub: true,
            }
        });

        // ── SCENE 3: Solution ────────────────────────────────────
        gsap.fromTo(".solution-left",
            { x: -100, opacity: 0 },
            {
                x: 0, opacity: 1,
                scrollTrigger: {
                    trigger: "#scene-solution",
                    start: "top 80%", end: "top 30%", scrub: 1,
                }
            }
        );
        gsap.fromTo(".solution-right",
            { x: 100, opacity: 0 },
            {
                x: 0, opacity: 1,
                scrollTrigger: {
                    trigger: "#scene-solution",
                    start: "top 80%", end: "top 30%", scrub: 1.2,
                }
            }
        );

        gsap.utils.toArray(".question-list li, .feature-list li").forEach((li, i) => {
            gsap.fromTo(li,
                { x: i % 2 === 0 ? -50 : 50, opacity: 0 },
                {
                    x: 0, opacity: 1,
                    scrollTrigger: {
                        trigger: li,
                        start: "top 90%", end: "top 65%", scrub: 0.8,
                    }
                }
            );
        });

        // ── SCENE 4: Timeline ────────────────────────────────────
        gsap.to(".timeline-line", {
            scaleY: 1,
            scrollTrigger: {
                trigger: ".timeline-container",
                start: "top center", end: "bottom center",
                scrub: true,
            }
        });

        gsap.utils.toArray(".timeline-item").forEach((item, i) => {
            gsap.fromTo(item,
                { x: -60, opacity: 0 },
                {
                    x: 0, opacity: 1,
                    duration: 0.8, ease: "power2.out",
                    scrollTrigger: {
                        trigger: item,
                        start: "top 72%",
                        toggleActions: "play none none reverse",
                    }
                }
            );
        });

        // Parallax floating icons
        gsap.to(".i1", { y: -220, x: -40, scrollTrigger: { trigger: "#scene-timeline", start: "top bottom", end: "bottom top", scrub: 1 } });
        gsap.to(".i2", { y: -360, x: 80, scrollTrigger: { trigger: "#scene-timeline", start: "top bottom", end: "bottom top", scrub: 2 } });
        gsap.to(".i3", { y: -180, x: -20, scrollTrigger: { trigger: "#scene-timeline", start: "top bottom", end: "bottom top", scrub: 1.5 } });

        // ── SOC Carousel reveal ───────────────────────────────────
        gsap.fromTo("#scene-soc-slider .headline-medium, #scene-soc-slider .soc-slider-desc",
            { y: 50, opacity: 0 },
            {
                y: 0, opacity: 1, stagger: 0.2,
                scrollTrigger: {
                    trigger: "#scene-soc-slider",
                    start: "top 80%", end: "top 50%", scrub: 1,
                }
            }
        );
        gsap.fromTo(".soc-carousel-container",
            { y: 80, opacity: 0 },
            {
                y: 0, opacity: 1,
                scrollTrigger: {
                    trigger: "#scene-soc-slider",
                    start: "top 70%", end: "top 30%", scrub: 1.2,
                }
            }
        );

        // ── SCENE 4.6: Horizontal Scroll ─────────────────────────
        const horizontalContainer = document.querySelector(".horizontal-content");
        const horizontalSections = gsap.utils.toArray(".h-panel");

        if (horizontalContainer && horizontalSections.length) {
            const scrollWidth = horizontalContainer.scrollWidth - document.documentElement.clientWidth;

            const horizontalTl = gsap.timeline({
                scrollTrigger: {
                    trigger: "#scene-horizontal-actors",
                    start: "top top",
                    end: () => `+=${scrollWidth}`,
                    pin: true,
                    scrub: 1,
                    invalidateOnRefresh: true,
                    anticipatePin: 1,
                }
            });

            horizontalTl.to(horizontalSections, {
                xPercent: -100 * (horizontalSections.length - 1),
                ease: "none",
            });

            // 3D orbit effect per card
            gsap.utils.toArray(".actor-card").forEach((card) => {
                gsap.to(card, {
                    scrollTrigger: {
                        trigger: card,
                        containerAnimation: horizontalTl,
                        start: "left center+=20%",
                        end: "right center-=20%",
                        scrub: true,
                        onUpdate(self) {
                            const p = self.progress;
                            gsap.set(card, {
                                rotateY: (p - 0.5) * -40,
                                scale: 1 - Math.abs(p - 0.5) * 0.12,
                                z: Math.abs(p - 0.5) * -80,
                            });
                        }
                    }
                });
            });
        }

        // ── SCENE 5: Audience cards ───────────────────────────────
        gsap.utils.toArray(".a-card").forEach((card, i) => {
            const visual = card.querySelector(".a-card-visual");
            const text = card.querySelector(".a-card-text");
            const fromX = i % 2 === 0 ? -90 : 90;

            gsap.set(card, { opacity: 0, x: fromX });
            if (visual) gsap.set(visual, { rotateY: i % 2 === 0 ? 65 : -65, scale: 0.85 });

            ScrollTrigger.create({
                trigger: card,
                start: "top 80%",
                once: true,
                onEnter() {
                    const tl = gsap.timeline();
                    tl.to(card, { opacity: 1, x: 0, duration: 0.9, ease: "expo.out" })
                        .to(visual, { rotateY: 0, scale: 1, duration: 1.1, ease: "expo.out" }, "-=0.7");
                    if (text) tl.fromTo(text, { opacity: 0, x: i % 2 === 0 ? 30 : -30 }, { opacity: 1, x: 0, duration: 0.7, ease: "power2.out" }, "-=0.5");

                    // Gentle perpetual float on image
                    if (visual) {
                        tl.to(visual, {
                            y: "random(-8, 8)",
                            duration: "random(3, 5)",
                            repeat: -1, yoyo: true, ease: "sine.inOut",
                        }, "+=0.3");
                    }
                }
            });
        });

        // Ring rotation parallax
        gsap.to(".ring-1", { rotateZ: 360, scrollTrigger: { trigger: "#scene-audience", start: "top bottom", end: "bottom top", scrub: 1 } });
        gsap.to(".ring-2", { rotateZ: -360, scrollTrigger: { trigger: "#scene-audience", start: "top bottom", end: "bottom top", scrub: 1.5 } });

        // Matrix transition
        gsap.fromTo(".matrix-headline",
            { opacity: 0, scale: 0.88, y: 60 },
            {
                opacity: 1, scale: 1, y: 0,
                scrollTrigger: {
                    trigger: ".narrative-transition--matrix",
                    start: "top 80%", end: "center 40%", scrub: 1,
                }
            }
        );

        // ── SCENE 6: Outro ───────────────────────────────────────
        gsap.fromTo(".massive-text",
            { y: 80, opacity: 0, scale: 0.88 },
            {
                y: 0, opacity: 1, scale: 1,
                stagger: 0.35,
                scrollTrigger: {
                    trigger: "#scene-outro",
                    start: "top 80%", end: "top 30%", scrub: 1.5,
                }
            }
        );
        gsap.fromTo(".btn-glow",
            { opacity: 0, y: 30 },
            {
                opacity: 1, y: 0,
                scrollTrigger: {
                    trigger: "#scene-outro",
                    start: "top 60%", end: "top 30%", scrub: 1,
                }
            }
        );

        // ── Client logos stagger ─────────────────────────────────
        gsap.from(".client-logo", {
            y: 40, opacity: 0, stagger: 0.07, duration: 0.6, ease: "power2.out",
            scrollTrigger: {
                trigger: "#scene-clients",
                start: "top 85%",
                toggleActions: "play none none none",
            }
        });

        // ── Ambient Particle layer parallax ──────────────────────
        const particleContainer = document.createElement("div");
        particleContainer.className = "parallax-particles";
        document.body.appendChild(particleContainer);
        for (let i = 0; i < 30; i++) {
            const p = document.createElement("div");
            p.className = "parallax-particle";
            p.style.cssText = `left:${Math.random() * 100}vw;top:${Math.random() * 100}vh;width:${Math.random() * 3 + 1}px;height:${Math.random() * 3 + 1}px`;
            particleContainer.appendChild(p);
        }
        gsap.to(".parallax-particles", {
            y: -260, x: -100, ease: "none",
            scrollTrigger: { trigger: "body", start: "top top", end: "bottom bottom", scrub: 2 }
        });

    }); // end desktop mm

    // ================================================================
    //  MOBILE ANIMATIONS (≤ 768px) – lighter, CSS-transition safe
    // ================================================================
    mm.add("(max-width: 768px)", () => {

        // Simple fade + slide-up for every main section element
        const fadeEls = gsap.utils.toArray([
            ".headline-large", ".headline-medium", ".solution-headline",
            ".solution-left", ".solution-right",
            ".threat-card", ".timeline-item",
            ".a-card", ".soc-carousel-container",
            ".massive-text", ".scroll-narrative-text", ".matrix-headline",
            ".h-panel", ".outro-content",
        ]);

        if (!prefersReduced) {
            fadeEls.forEach((el, i) => {
                gsap.fromTo(el,
                    { y: 40, opacity: 0 },
                    {
                        y: 0, opacity: 1, duration: 0.7, ease: "power2.out",
                        scrollTrigger: {
                            trigger: el,
                            start: "top 88%",
                            toggleActions: "play none none none",
                        }
                    }
                );
            });
        }

        // Timeline line on mobile
        gsap.to(".timeline-line", {
            scaleY: 1,
            scrollTrigger: {
                trigger: ".timeline-container",
                start: "top center", end: "bottom center",
                scrub: true,
            }
        });

        // Word reveal on mobile (simpler)
        gsap.from(".word-reveal", {
            y: 30, opacity: 0, stagger: 0.06, duration: 1, ease: "power2.out", delay: 0.2,
        });

    }); // end mobile mm

    // ================================================================
    //  SOC Carousel (shared – works on all)
    // ================================================================
    const slides = document.querySelectorAll(".soc-slide");
    const nextBtn = document.querySelector(".next-btn");
    const prevBtn = document.querySelector(".prev-btn");
    let currentSlide = 0;

    function updateCarousel() {
        slides.forEach((slide, idx) => {
            slide.classList.remove("active", "prev", "next");
            if (idx === currentSlide) slide.classList.add("active");
            else if (idx === (currentSlide - 1 + slides.length) % slides.length) slide.classList.add("prev");
            else if (idx === (currentSlide + 1) % slides.length) slide.classList.add("next");
        });
    }

    if (nextBtn && prevBtn) {
        nextBtn.addEventListener("click", () => { currentSlide = (currentSlide + 1) % slides.length; updateCarousel(); });
        prevBtn.addEventListener("click", () => { currentSlide = (currentSlide - 1 + slides.length) % slides.length; updateCarousel(); });
        setInterval(() => { currentSlide = (currentSlide + 1) % slides.length; updateCarousel(); }, 5000);
    }

    // ================================================================
    //  Mouse-reactive glow on headline
    // ================================================================
    if (!isMobile) {
        window.addEventListener("mousemove", (e) => {
            const xPct = (e.clientX / window.innerWidth - 0.5) * 2;
            gsap.to(".text-glow", {
                textShadow: `0 0 ${20 + Math.abs(xPct) * 22}px rgba(0,240,255,0.55)`,
                duration: 0.45,
                overwrite: "auto",
            });
        }, { passive: true });
    }

});
