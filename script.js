// JavaScript for Interactivity
        // Global variables for slideshow and auto-play timer
        let slideIndex = 0;
        let slides = [];
        let slideTimer;

        /**
         * UPDATED: updateSlideshow function now accepts a 'snap' parameter.
         * If snap is true, it temporarily removes transition classes
         * to prevent animation during window resize.
         */
        function updateSlideshow(snap = false) {
            const container = document.getElementById('slideshow-container');
            if (!container) return; // Guard clause

            // Ensure slides array is populated
            if (slides.length === 0) {
                slides = document.querySelectorAll('#slideshow-container .slide');
            }
            if (slides.length > 0) {
                const slideWidth = container.clientWidth; // Use container width for responsiveness

                if (snap) {
                    // Temporarily disable transition for instant snapping
                    container.classList.remove('transition-transform', 'duration-500', 'ease-in-out');
                }

                container.style.transform = `translateX(-${slideIndex * slideWidth}px)`;

                if (snap) {
                    // Force browser reflow to apply the transform instantly
                    // Then re-add transition classes for future slides
                    // Using requestAnimationFrame for modern browsers
                    requestAnimationFrame(() => {
                        container.classList.add('transition-transform', 'duration-500', 'ease-in-out');
                    });
                }
            }
        }

        // Function to start the automatic slideshow timer
        function startSlideShow() {
            // Clear any existing timer first to prevent duplicates
            clearInterval(slideTimer);
            // Set new timer to advance the slide every 5 seconds
            slideTimer = setInterval(() => {
                window.changeSlide(1, false); // false means "do not reset timer"
            }, 5000); // 5 seconds interval
        }

        /**
         * Global function to change the slide. 
         * resetTimer=true is the default for manual clicks.
         * Calls updateSlideshow(false) to ensure smooth animation.
         */
        window.changeSlide = function (n, resetTimer = true) {
            slides = document.querySelectorAll('#slideshow-container .slide'); // Re-query just in case
            slideIndex += n;

            // Loop back to the start or end if boundaries are reached
            if (slideIndex >= slides.length) {
                slideIndex = 0;
            }
            if (slideIndex < 0) {
                slideIndex = slides.length - 1;
            }

            updateSlideshow(false); // false means "use transition"

            // Only restart the timer if manual controls (buttons) were used
            if (resetTimer) {
                startSlideShow();
            }
        };

        // --- Typing Effect Logic for Hero Section ---
        const typingTextElement = document.getElementById('typing-text');
        const phrases = ["Software Engineer", "Cloud Developer", "Full-Stack Developer", "Problem Solver"];
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function typeWriter() {
            if (!typingTextElement) return; // Guard against element not existing

            const currentPhrase = phrases[phraseIndex];
            const typeSpeed = isDeleting ? 75 : 150; // Faster deletion

            if (isDeleting) {
                // Delete mode
                typingTextElement.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
            } else {
                // Typing mode
                typingTextElement.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
            }

            if (!isDeleting && charIndex === currentPhrase.length) {
                // Start deleting after a pause
                setTimeout(() => isDeleting = true, 1500);
            } else if (isDeleting && charIndex === 0) {
                // Done deleting, move to next phrase
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
            }

            const nextDelay = isDeleting && charIndex > 0 ? typeSpeed : (charIndex === 0 && !isDeleting ? typeSpeed : (charIndex === currentPhrase.length && !isDeleting ? 1500 : typeSpeed));
            setTimeout(typeWriter, nextDelay);
        }


        document.addEventListener('DOMContentLoaded', () => {
            // Initialize Lucide icons
            lucide.createIcons();

            // Initial slideshow setup
            slides = document.querySelectorAll('#slideshow-container .slide');
            updateSlideshow(true); // Initial render with snap=true

            // UPDATED: Resize listener now calls updateSlideshow with snap=true
            window.addEventListener('resize', () => updateSlideshow(true));

            // Start the automatic slideshow upon loading
            startSlideShow();

            const body = document.body;
            // const themeToggle = document.getElementById('theme-toggle');
            // const themeIcon = document.getElementById('theme-icon');
            const mobileMenuButton = document.getElementById('mobile-menu-button');
            const mobileMenu = document.getElementById('mobile-menu');
            const navLinks = document.querySelectorAll('.nav-link');
            const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
            const form = document.getElementById('contact-form');
            const statusMessage = document.getElementById('status-message');
            const submitButton = document.getElementById('submit-button');

            // Start the typing animation
            if (typingTextElement) {
                typeWriter();
            }


            // --- Theme Toggle Logic ---
            // const currentTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

            // if (currentTheme === 'dark') {
            //     body.classList.add('dark');
            //     updateThemeIcon('sun');
            // } else {
            //     updateThemeIcon('moon');
            // }

            // function updateThemeIcon(iconName) {
            //     themeIcon.innerHTML = `<i data-lucide="${iconName}" class="w-5 h-5 text-gray-500 dark:text-gray-400"></i>`;
            //     lucide.createIcons();
            // }

            // themeToggle.addEventListener('click', () => {
            //     body.classList.toggle('dark');
            //     const newTheme = body.classList.contains('dark') ? 'dark' : 'light';
            //     localStorage.setItem('theme', newTheme);
            //     updateThemeIcon(newTheme === 'dark' ? 'sun' : 'moon');
            // });


            // --- Mobile Menu Toggle ---
            mobileMenuButton.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
                mobileMenuButton.querySelector('i').setAttribute('data-lucide', mobileMenu.classList.contains('hidden') ? 'menu' : 'x');
                lucide.createIcons();
            });

            // Close mobile menu when a link is clicked
            mobileNavLinks.forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenu.classList.add('hidden');
                    mobileMenuButton.querySelector('i').setAttribute('data-lucide', 'menu');
                    lucide.createIcons();
                });
            });


            // --- Navigation Active State & Intersection Observer ---
            const sections = document.querySelectorAll('section');

            const observerOptions = {
                root: null,
                rootMargin: '-50% 0px -50% 0px', // Center of viewport trigger
                threshold: 0.0 // Check for any intersection
            };

            const observer = new IntersectionObserver((entries) => {
                let activeSectionId = null;
                // Find the section that is currently intersecting
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Use the section ID directly
                        activeSectionId = entry.target.getAttribute('id');
                    }
                });

                // Update active link
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (activeSectionId && link.getAttribute('data-section') === activeSectionId) {
                        link.classList.add('active');
                    }
                });
            }, observerOptions);

            sections.forEach(section => {
                if (section.id) { // Only observe sections with an ID
                    observer.observe(section);
                }
            });
        });