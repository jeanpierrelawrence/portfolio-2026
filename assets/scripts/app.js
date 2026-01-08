const menuToggle = document.querySelector('.menu-toggle');
const menuOverlay = document.querySelector('.menu-overlay');

menuToggle.addEventListener('click', () => {
    // Toggle the "X" animation
    menuToggle.classList.toggle('is-active');
    
    // Toggle the menu visibility
    menuOverlay.classList.toggle('is-open');
    
    // Accessibility: prevent background scrolling when menu is open
    document.body.style.overflow = menuOverlay.classList.contains('is-open') ? 'hidden' : 'auto';
});

const initCarousel = () => {
    const slides = document.querySelectorAll('.project__exhibit');
    const dots = document.querySelectorAll('.pager__dot');

    if (slides.length === 0) return;

    const observerOptions = {
        threshold: 0.6 // Trigger when slide is 60% visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            // Toggle 'active' class on the slide for scaling
            entry.target.classList.toggle('active', entry.isIntersecting);

            if (entry.isIntersecting) {
                // Find the index of the centered slide
                const index = Array.from(slides).indexOf(entry.target);

                // Update the dots
                dots.forEach((dot, i) => {
                    dot.classList.toggle('active', i === index);
                });
            }
        });
    }, observerOptions);

    slides.forEach((slide) => observer.observe(slide));
};

// Start the carousel logic
initCarousel();