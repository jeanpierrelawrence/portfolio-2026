gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

// 1. Grab all elements with your 'scroll' class
const scrollElements = document.querySelectorAll(".sroll-trigger");

// 2. Loop through each one individually
scrollElements.forEach((el) => {
  gsap.from(el, {
    scrollTrigger: {
      trigger: el,      // The trigger is the element ITSELF
      start: "top 85%", // Start when the element is near the bottom
      end: "top 50%",
      scrub: 1,         // Smooth catch-up
      markers: false    // Turn on to debug
    },
    y: 50,
    opacity: 0,
    duration: 1
  });
});