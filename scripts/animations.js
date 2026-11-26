/**
 * Portfolio GSAP Choreography
 * High-end editorial motion system: masked typography, clip-path wipes,
 * scrubbed parallax, 3D perspective cards, and pointer micro-interactions.
 */
(() => {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Prevent ScrollTrigger from jumping on mobile address-bar resize
    ScrollTrigger.config({ ignoreMobileResize: true });

    // Smooth anchor navigation without CSS scroll-behavior conflicts
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", (e) => {
            const targetId = anchor.getAttribute("href");
            if (!targetId || targetId === "#") return;
            const target = document.querySelector(targetId);
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    });

    /**
     * Splits an element's text into masked inline-block word spans
     * so words can slide up out of an invisible baseline mask.
     */
    function splitWordsMasked(el) {
        if (!el || el.dataset.splitDone) return [];
        el.dataset.splitDone = "true";

        const rawText = el.textContent.trim();
        const words = rawText.split(/\s+/);
        el.textContent = "";

        const innerSpans = [];
        words.forEach((word, index) => {
            const mask = document.createElement("span");
            mask.style.display = "inline-block";
            mask.style.overflow = "hidden";
            mask.style.verticalAlign = "bottom";
            // Pad slightly so descenders & tight negative tracking never clip
            mask.style.paddingBottom = "0.14em";
            mask.style.marginBottom = "-0.14em";
            mask.style.paddingInline = "0.06em";
            mask.style.marginInline = "-0.06em";

            const inner = document.createElement("span");
            inner.style.display = "inline-block";
            inner.style.willChange = "transform, opacity";
            inner.textContent = word;

            mask.appendChild(inner);
            el.appendChild(mask);
            innerSpans.push(inner);

            if (index < words.length - 1) {
                el.appendChild(document.createTextNode(" "));
            }
        });

        return innerSpans;
    }

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
        const EASE_OUT = "power3.out";
        const EASE_EXPO = "expo.out";

        /* ====================================================================
           0. SCROLL PROGRESS HAIRLINE
           ==================================================================== */
        const progressBar = document.createElement("div");
        progressBar.setAttribute("aria-hidden", "true");
        Object.assign(progressBar.style, {
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "2px",
            backgroundColor: "#000E10",
            transformOrigin: "left center",
            transform: "scaleX(0)",
            zIndex: "9999",
            pointerEvents: "none"
        });
        document.body.appendChild(progressBar);

        gsap.to(progressBar, {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
                trigger: document.documentElement,
                start: "top top",
                end: "bottom bottom",
                scrub: 0.2
            }
        });

        /* ====================================================================
           1. HEADER & MASKED HERO ENTRANCE
           ==================================================================== */
        const heroFocal = document.querySelector(".hero-focal");
        const heroWords = splitWordsMasked(heroFocal);

        const heroTl = gsap.timeline({ defaults: { ease: EASE_EXPO } });

        heroTl
            .from("header .header-meta", {
                y: -16,
                opacity: 0,
                duration: 0.7,
                clearProps: "transform,opacity"
            })
            .from(
                "header .header-nav li",
                {
                    y: -16,
                    opacity: 0,
                    duration: 0.65,
                    stagger: 0.08,
                    clearProps: "transform,opacity"
                },
                "-=0.5"
            );

        if (heroWords.length) {
            heroTl.from(
                heroWords,
                {
                    yPercent: 115,
                    rotateZ: 2.5,
                    opacity: 0,
                    duration: 1.1,
                    stagger: 0.09,
                    clearProps: "transform,opacity"
                },
                "-=0.45"
            );
        }

        if (document.querySelector(".hero-footer")) {
            heroTl
                .from(
                    ".hero-footer p",
                    {
                        y: 26,
                        opacity: 0,
                        duration: 0.85,
                        ease: EASE_OUT,
                        clearProps: "transform,opacity"
                    },
                    "-=0.7"
                )
                .from(
                    ".hero-footer .scroll-indicator",
                    {
                        y: 16,
                        opacity: 0,
                        duration: 0.7,
                        ease: EASE_OUT,
                        clearProps: "transform,opacity"
                    },
                    "-=0.6"
                );

            // Idle float on scroll indicator
            gsap.to(".hero-footer .scroll-indicator", {
                y: 6,
                duration: 1.5,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: 1.3
            });

            // Scrubbed hero parallax depth on scroll
            if (heroFocal) {
                gsap.to(heroFocal, {
                    yPercent: -10,
                    opacity: 0.35,
                    ease: "none",
                    scrollTrigger: {
                        trigger: ".hero",
                        start: "top top",
                        end: "bottom top",
                        scrub: true
                    }
                });
            }

            gsap.to(".hero-footer .scroll-indicator", {
                opacity: 0,
                ease: "none",
                scrollTrigger: {
                    trigger: ".hero",
                    start: "top top",
                    end: "40% top",
                    scrub: true
                }
            });
        }

        /* ====================================================================
           2. MASKED SECTION HEADINGS (Shared)
           ==================================================================== */
        document
            .querySelectorAll(".work > h2, .principles > h2, .narrative-section > h2, .contact > h2")
            .forEach((heading) => {
                const words = splitWordsMasked(heading);
                if (!words.length) return;

                gsap.from(words, {
                    yPercent: 110,
                    opacity: 0,
                    duration: 0.9,
                    stagger: 0.055,
                    ease: EASE_EXPO,
                    clearProps: "transform,opacity",
                    scrollTrigger: {
                        trigger: heading,
                        start: "top 86%",
                        once: true
                    }
                });
            });

        /* ====================================================================
           3. HOME PAGE — WORK CARDS (Clip-Path Curtain + Image Parallax)
           ==================================================================== */
        if (document.querySelector(".work")) {
            gsap.from(".work > .sub-title", {
                x: -20,
                opacity: 0,
                duration: 0.7,
                ease: EASE_OUT,
                clearProps: "transform,opacity",
                scrollTrigger: {
                    trigger: ".work",
                    start: "top 85%",
                    once: true
                }
            });

            document.querySelectorAll(".work-item").forEach((item, i) => {
                const img = item.querySelector("img");
                const content = item.querySelector(".content");

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: item,
                        start: "top 86%",
                        once: true
                    }
                });

                tl.fromTo(
                    item,
                    {
                        clipPath: "inset(14% 0% 14% 0% round 1.875rem)",
                        y: 40,
                        opacity: 0
                    },
                    {
                        clipPath: "inset(0% 0% 0% 0% round 1.875rem)",
                        y: 0,
                        opacity: 1,
                        duration: 1.05,
                        delay: (i % 2) * 0.1,
                        ease: EASE_EXPO,
                        clearProps: "clipPath,transform,opacity"
                    }
                );

                if (img) {
                    tl.fromTo(
                        img,
                        { scale: 1.2 },
                        {
                            scale: 1.06,
                            duration: 1.2,
                            ease: EASE_EXPO
                        },
                        0
                    );

                    // Subtle scrubbed inner-image parallax while scrolling past
                    gsap.fromTo(
                        img,
                        { yPercent: -4 },
                        {
                            yPercent: 4,
                            ease: "none",
                            scrollTrigger: {
                                trigger: item,
                                start: "top bottom",
                                end: "bottom top",
                                scrub: true
                            }
                        }
                    );
                }

                if (content) {
                    tl.from(
                        content,
                        {
                            y: 20,
                            opacity: 0,
                            duration: 0.7,
                            ease: EASE_OUT,
                            clearProps: "transform,opacity"
                        },
                        "-=0.7"
                    );
                }
            });
        }

        /* ====================================================================
           4. HOME PAGE — PRINCIPLES (Sticky Folder Stack + Depth Scrub)
           ==================================================================== */
        if (document.querySelector(".principles")) {
            gsap.from(".principles > .sub-title", {
                x: -20,
                opacity: 0,
                duration: 0.7,
                ease: EASE_OUT,
                clearProps: "transform,opacity",
                scrollTrigger: {
                    trigger: ".principles",
                    start: "top 85%",
                    once: true
                }
            });

            const principleCards = gsap.utils.toArray(".principles-item");

            principleCards.forEach((card, index) => {
                const tags = card.querySelectorAll(".tag");
                const title = card.querySelector("h3");
                const body = card.querySelector("p");

                // Reveal inner content as card enters viewport
                const contentTl = gsap.timeline({
                    scrollTrigger: {
                        trigger: card,
                        start: "top 85%",
                        once: true
                    }
                });

                if (title) {
                    contentTl.from(title, {
                        y: 22,
                        opacity: 0,
                        duration: 0.65,
                        ease: EASE_OUT,
                        clearProps: "transform,opacity"
                    });
                }

                if (tags.length) {
                    contentTl.from(
                        tags,
                        {
                            scale: 0.82,
                            y: 12,
                            opacity: 0,
                            duration: 0.5,
                            stagger: 0.055,
                            ease: "back.out(1.4)",
                            clearProps: "transform,opacity"
                        },
                        "-=0.45"
                    );
                }

                if (body) {
                    contentTl.from(
                        body,
                        {
                            y: 18,
                            opacity: 0,
                            duration: 0.65,
                            ease: EASE_OUT,
                            clearProps: "transform,opacity"
                        },
                        "-=0.35"
                    );
                }

                // Scrubbed folder-stack depth with smooth inertia as the next card stacks on top
                const nextCard = principleCards[index + 1];
                if (nextCard) {
                    const depth = principleCards.length - 1 - index;
                    const targetScale = 1 - depth * 0.035;
                    gsap.to(card, {
                        scale: targetScale,
                        y: -depth * 6,
                        transformOrigin: "center top",
                        ease: "power1.out",
                        scrollTrigger: {
                            trigger: nextCard,
                            start: "top 85%",
                            end: "top 20%",
                            scrub: 0.65
                        }
                    });
                }
            });
        }

        /* ====================================================================
           5. CASE STUDY PAGES — BENTO GRID & NARRATIVE TEXT CHOREOGRAPHY
           ==================================================================== */
        if (document.querySelector(".bento-grid")) {
            ScrollTrigger.batch(".bento-card", {
                start: "top 90%",
                once: true,
                onEnter: (batch) => {
                    gsap.from(batch, {
                        y: 28,
                        scale: 0.97,
                        opacity: 0,
                        duration: 0.75,
                        stagger: 0.07,
                        ease: EASE_EXPO,
                        overwrite: "auto",
                        clearProps: "transform,opacity"
                    });

                    batch.forEach((card, idx) => {
                        const img = card.querySelector("img");
                        if (img) {
                            gsap.from(img, {
                                scale: 1.08,
                                duration: 0.95,
                                delay: idx * 0.07,
                                ease: EASE_EXPO,
                                overwrite: "auto",
                                clearProps: "transform"
                            });
                        }

                        const stackItems = card.querySelectorAll("li");
                        if (stackItems.length) {
                            gsap.from(stackItems, {
                                y: 12,
                                opacity: 0,
                                duration: 0.5,
                                stagger: 0.06,
                                delay: idx * 0.07 + 0.15,
                                ease: EASE_OUT,
                                clearProps: "transform,opacity"
                            });
                        }
                    });
                }
            });
        }

        if (document.querySelector(".narrative-section")) {
            document.querySelectorAll(".narrative-card").forEach((card) => {
                const heading = card.querySelector("h3");
                const paragraph = card.querySelector("p");
                const headingWords = splitWordsMasked(heading);

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: card,
                        start: "top 86%",
                        once: true
                    }
                });

                if (headingWords.length) {
                    tl.from(headingWords, {
                        yPercent: 110,
                        opacity: 0,
                        duration: 0.85,
                        stagger: 0.05,
                        ease: EASE_EXPO,
                        clearProps: "transform,opacity"
                    });
                } else if (heading) {
                    tl.from(heading, {
                        y: 20,
                        opacity: 0,
                        duration: 0.7,
                        ease: EASE_OUT,
                        clearProps: "transform,opacity"
                    });
                }

                if (paragraph) {
                    tl.fromTo(
                        paragraph,
                        {
                            clipPath: "inset(0% 0% 100% 0%)",
                            y: 16,
                            opacity: 0
                        },
                        {
                            clipPath: "inset(0% 0% 0% 0%)",
                            y: 0,
                            opacity: 1,
                            duration: 0.9,
                            ease: EASE_OUT,
                            clearProps: "clipPath,transform,opacity"
                        },
                        "-=0.45"
                    );
                }
            });
        }

        /* ====================================================================
           6. CONTACT & FOOTER
           ==================================================================== */
        if (document.querySelector(".contact")) {
            gsap.from(".contact > .sub-title", {
                y: 20,
                opacity: 0,
                duration: 0.7,
                ease: EASE_OUT,
                clearProps: "transform,opacity",
                scrollTrigger: {
                    trigger: ".contact",
                    start: "top 88%",
                    once: true
                }
            });

            const contactBox = document.querySelector(".contact-box, .contact-card");
            if (contactBox) {
                gsap.from(contactBox, {
                    scale: 0.93,
                    y: 44,
                    opacity: 0,
                    duration: 0.95,
                    ease: EASE_EXPO,
                    clearProps: "transform,opacity",
                    scrollTrigger: {
                        trigger: contactBox,
                        start: "top 88%",
                        once: true
                    }
                });
            }
        }

        if (document.querySelector(".footer-grid")) {
            gsap.from(".footer-grid", {
                y: 20,
                opacity: 0,
                duration: 0.75,
                ease: EASE_OUT,
                clearProps: "transform,opacity",
                scrollTrigger: {
                    trigger: "footer",
                    start: "top 96%",
                    once: true
                }
            });
        }

        /* ====================================================================
           7. POINTER-ONLY MICRO-INTERACTIONS (3D Tilt, Zoom, Magnetic)
           ==================================================================== */
        mm.add("(hover: hover) and (pointer: fine)", () => {
            // Work card hover: smooth zoom + arrow glide + title lift
            document.querySelectorAll(".work-item a").forEach((link) => {
                const img = link.querySelector("img");
                const arrow = link.querySelector(".content svg");
                const content = link.querySelector(".content");

                link.addEventListener("mouseenter", () => {
                    if (img) gsap.to(img, { scale: 1.11, duration: 0.65, ease: EASE_OUT });
                    if (arrow) gsap.to(arrow, { x: 8, duration: 0.4, ease: EASE_OUT });
                    if (content) gsap.to(content, { y: -5, duration: 0.4, ease: EASE_OUT });
                });

                link.addEventListener("mouseleave", () => {
                    if (img) gsap.to(img, { scale: 1.06, duration: 0.65, ease: EASE_OUT });
                    if (arrow) gsap.to(arrow, { x: 0, duration: 0.4, ease: EASE_OUT });
                    if (content) gsap.to(content, { y: 0, duration: 0.4, ease: EASE_OUT });
                });
            });

            // Subtle image zoom on bento card hover (animates inner img so card grid transforms never conflict)
            document.querySelectorAll(".bento-card").forEach((card) => {
                const img = card.querySelector("img");
                if (!img) return;

                card.addEventListener("mouseenter", () => {
                    gsap.to(img, { scale: 1.04, duration: 0.55, ease: EASE_OUT, overwrite: "auto" });
                });

                card.addEventListener("mouseleave", () => {
                    gsap.to(img, { scale: 1, duration: 0.55, ease: EASE_OUT, overwrite: "auto" });
                });
            });

            // Magnetic pull on pill buttons
            document.querySelectorAll(".rounded-btn, .btn-live").forEach((btn) => {
                const xTo = gsap.quickTo(btn, "x", { duration: 0.35, ease: EASE_OUT });
                const yTo = gsap.quickTo(btn, "y", { duration: 0.35, ease: EASE_OUT });

                btn.addEventListener("mousemove", (e) => {
                    const rect = btn.getBoundingClientRect();
                    const relX = e.clientX - rect.left - rect.width / 2;
                    const relY = e.clientY - rect.top - rect.height / 2;
                    xTo(relX * 0.18);
                    yTo(relY * 0.24);
                });

                btn.addEventListener("mouseleave", () => {
                    xTo(0);
                    yTo(0);
                });
            });
        });

        // Refresh ScrollTrigger once all images/fonts settle so triggers align accurately
        window.addEventListener("load", () => ScrollTrigger.refresh());
        document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
            img.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
        });
    });
})();
