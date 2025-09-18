document.addEventListener('DOMContentLoaded', () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');
    const header = document.querySelector('.header');
    const menuOverlay = document.querySelector('.menu-overlay');

    // Toggle Nav
    burger.addEventListener('click', () => {
        nav.classList.toggle('nav-active');
        burger.classList.toggle('toggle');
        menuOverlay.classList.toggle('active');

        navLinks.forEach((link, index) => {
            if (nav.classList.contains('nav-active')) {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            } else {
                link.style.animation = `navLinkFadeOut 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });
    });

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });

            if (nav.classList.contains('nav-active')) {
                nav.classList.remove('nav-active');
                burger.classList.remove('toggle');
                menuOverlay.classList.remove('active');
                navLinks.forEach(link => {
                    link.style.animation = '';
                });
            }
        });
    });

    // Typing Effect for Hero Section
    const typedTextSpan = document.querySelector('.typed-text');
    const phrases = ["MBA Candidate", "Marketing Specialist", "Data-Driven Analyst", "Problem Solver"];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeWriter() {
        const currentPhrase = phrases[phraseIndex];
        if (isDeleting) {
            typedTextSpan.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typedTextSpan.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = 100;
        if (isDeleting) typeSpeed /= 2;

        if (!isDeleting && charIndex === currentPhrase.length) {
            typeSpeed = 1500;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 500;
        }

        setTimeout(typeWriter, typeSpeed);
    }

    typeWriter();

    // Scroll Animations for sections and elements
    const scrollObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                entry.target.classList.remove('hidden');
                scrollObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    // Observe initial hidden elements
    document.querySelectorAll('.hidden').forEach(element => {
        scrollObserver.observe(element);
    });

    // Project Modals
    const projectModal = document.getElementById('project-modal');
    const closeModalBtn = document.querySelector('.close-button');
    const modalImage = document.querySelector('.modal-image');
    const modalTitle = document.querySelector('.modal-title');
    const modalDescription = document.querySelector('.modal-description');
    const modalDemoLink = document.querySelector('.modal-demo-link');
    const modalGithubLink = document.querySelector('.modal-github-link');
    const modalContent = document.querySelector('.modal-content'); // Get modal content for animation events

    let allProjectsData = [];

    function displayProjects(projects) {
        const projectGrid = document.querySelector('.project-grid');
        projectGrid.innerHTML = '';

        projects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.classList.add('project-card', 'hidden');
            projectCard.style.animationDelay = `${project.animationDelay || 0}s`;

            const techTags = project.technologies.map(tech => `<span class="tag">${tech}</span>`).join('');

            projectCard.innerHTML = `
                <img src="${project.image}" alt="${project.title} Image">
                <span class="project-category">${project.category || 'Marketing'}</span>
                <h3>${project.title}</h3>
                <p>${project.short_description}</p>
                <div class="project-tech-tags">
                    ${techTags}
                </div>
                <a href="#" class="btn-secondary view-details-btn" data-project-id="${project.id}">View Details</a>
            `;
            projectGrid.appendChild(projectCard);
        });

        document.querySelectorAll('.project-card.hidden').forEach(element => {
            scrollObserver.observe(element);
        });

        document.querySelectorAll('.view-details-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const projectId = e.target.dataset.projectId;
                const project = allProjectsData.find(p => p.id === projectId);

                if (project) {
                    modalImage.src = project.image;
                    modalTitle.textContent = project.title;
                    modalDescription.textContent = project.long_description;
                    modalDemoLink.href = project.demo_link || '#';
                    modalGithubLink.href = project.github_link || '#';

                    if (project.demo_link && project.demo_link !== '#') {
                        modalDemoLink.style.display = 'inline-block';
                    } else {
                        modalDemoLink.style.display = 'none';
                    }
                    if (project.github_link && project.github_link !== '#') {
                        modalGithubLink.style.display = 'inline-block';
                    } else {
                        modalGithubLink.style.display = 'none';
                    }

                    projectModal.style.display = 'flex';
                    projectModal.classList.remove('hide-modal');
                    projectModal.classList.add('show-modal');
                }
            });
        });
    }

    fetch('projects.json')
        .then(response => response.json())
        .then(data => {
            allProjectsData = data;
            displayProjects(data);

            // Project Filtering Logic
            const filterButtons = document.querySelectorAll('.btn-filter');
            filterButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    const filter = e.target.dataset.filter;

                    // Remove active class from all buttons
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    // Add active class to the clicked button
                    e.target.classList.add('active');

                    const filteredProjects = allProjectsData.filter(project => {
                        if (filter === 'all') {
                            return true;
                        }
                        return project.category === filter;
                    });
                    displayProjects(filteredProjects);
                });
            });
        })
        .catch(error => console.error('Error fetching projects:', error));

    closeModalBtn.addEventListener('click', () => {
        projectModal.classList.remove('show-modal');
        projectModal.classList.add('hide-modal');
    });

    // Hide modal after animation completes
    modalContent.addEventListener('animationend', (e) => {
        if (e.animationName === 'modalFadeOut') {
            projectModal.style.display = 'none';
        }
    });

    window.addEventListener('click', (e) => {
        if (e.target === projectModal) {
            projectModal.classList.remove('show-modal');
            projectModal.classList.add('hide-modal');
        }
    });

    // Header Shrink/Change on Scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Active Link Highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinksAnchors = document.querySelectorAll('.nav-links a');

    const sectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinksAnchors.forEach(link => {
                    link.classList.remove('active');
                });
                const currentNavLink = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
                if (currentNavLink) {
                    currentNavLink.classList.add('active');
                }
            }
        });
    }, {
        rootMargin: '-100px 0px -100px 0px'
    });

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Close menu when clicking on overlay
    menuOverlay.addEventListener('click', () => {
        nav.classList.remove('nav-active');
        burger.classList.remove('toggle');
        menuOverlay.classList.remove('active');
        navLinks.forEach(link => {
            link.style.animation = '';
        });
    });


        // Thank You Modal functionality
    const thankYouModal = document.getElementById('thank-you-modal');
    const thankYouMessage = document.getElementById('thank-you-message');
    const thankYouCloseButton = document.getElementById('thank-you-close-button');
    const thankYouOkButton = document.getElementById('thank-you-ok-button');
    const thankYouModalContent = thankYouModal.querySelector('.modal-content');

    function closeThankYouModal() {
        thankYouModal.classList.remove('show-modal');
        thankYouModal.classList.add('hide-modal');
    }

    thankYouCloseButton.addEventListener('click', closeThankYouModal);
    thankYouOkButton.addEventListener('click', closeThankYouModal);

    // Confetti effect function
    function createConfetti() {
        const confettiContainer = document.createElement('div');
        confettiContainer.className = 'confetti-container';
        document.body.appendChild(confettiContainer);

        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.animationDelay = Math.random() * 3 + 's';
            confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
            confettiContainer.appendChild(confetti);
        }

        setTimeout(() => {
            document.body.removeChild(confettiContainer);
        }, 3000);
    }

    // Accessibility: Focus management for thank you modal
    function openThankYouModal() {
        thankYouModal.style.display = 'flex';
        thankYouModal.classList.remove('hide-modal');
        thankYouModal.classList.add('show-modal');
        thankYouModal.setAttribute('aria-modal', 'true');
        thankYouModal.setAttribute('role', 'dialog');
        thankYouModal.setAttribute('tabindex', '-1');
        thankYouModal.focus();

        // Trigger confetti effect
        createConfetti();

        // Auto close after 5 seconds
        setTimeout(() => {
            closeThankYouModal();
        }, 5000);
    }

    thankYouModalContent.addEventListener('animationend', (e) => {
        if (e.animationName === 'modalFadeOut') {
            thankYouModal.style.display = 'none';
        }
    });

    window.addEventListener('click', (e) => {
        if (e.target === thankYouModal) {
            closeThankYouModal();
        }
    });


    

    // Contact Form AJAX Submission
    const contactForm = document.querySelector('.contact-form');
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent default form submission (page reload)

        const formData = new FormData(contactForm);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        if (!data.name || !data.email || !data.message) {
            alert('Please fill in all required fields (Name, Email, Message).');
            return;
        }

        fetch('https://formspree.io/f/meolbyvr', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json' // Important for Formspree AJAX
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json()) // Formspree returns JSON
        .then(result => {
            if (result.ok) { // Formspree uses 'ok' for success
                const submittedName = data.name || 'Guest'; // Get name from form data
                thankYouMessage.textContent = `Thank you, ${submittedName}! Your message has been sent. I will get back to you shortly.`;
                openThankYouModal(); // Show the modal with enhancements
                contactForm.reset(); // Clear the form
            } else {
                alert('Failed to send message. Please try again later.');
                console.error('Formspree error:', result);
            }
        })
        .catch(error => {
            alert('An error occurred. Please try again later.');
            console.error('Contact form submission error:', error);
        });
    });

    particlesJS("particles-js", {
        "particles": {
            "number": {
                "value": 80,
                "density": {
                    "enable": true,
                    "value_area": 800
                }
            },
            "color": {
                "value": "#ffffff"
            },
            "shape": {
                "type": "circle",
                "stroke": {
                    "width": 0,
                    "color": "#000000"
                },
                "polygon": {
                    "nb_sides": 5
                }
            },
            "opacity": {
                "value": 0.5,
                "random": false,
                "anim": {
                    "enable": false,
                    "speed": 1,
                    "opacity_min": 0.1,
                    "sync": false
                }
            },
            "size": {
                "value": 3,
                "random": true,
                "anim": {
                    "enable": false,
                    "speed": 40,
                    "size_min": 0.1,
                    "sync": false
                }
            },
            "line_linked": {
                "enable": true,
                "distance": 150,
                "color": "#ffffff",
                "opacity": 0.4,
                "width": 1
            },
            "move": {
                "enable": true,
                "speed": 6,
                "direction": "none",
                "random": false,
                "straight": false,
                "out_mode": "out",
                "bounce": false,
                "attract": {
                    "enable": false,
                    "rotateX": 600,
                    "rotateY": 1200
                }
            }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": {
                "onhover": {
                    "enable": true,
                    "mode": "repulse"
                },
                "onclick": {
                    "enable": true,
                    "mode": "push"
                },
                "resize": true
            },
            "modes": {
                "grab": {
                    "distance": 400,
                    "line_linked": {
                        "opacity": 1
                    }
                },
                "bubble": {
                    "distance": 400,
                    "size": 40,
                    "duration": 2,
                    "opacity": 8,
                    "speed": 3
                },
                "repulse": {
                    "distance": 200,
                    "duration": 0.4
                },
                "push": {
                    "particles_nb": 4
                },
                "remove": {
                    "particles_nb": 2
                }
            }
        },
        "retina_detect": true
    });
});
