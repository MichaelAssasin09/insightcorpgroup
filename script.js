document.addEventListener('DOMContentLoaded', () => {
    
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });

    const typingTitle = document.getElementById('typing-title');
    if (typingTitle) {
        const text = "Satu Imajinasi,<br>Seribu Kenyataan.";
        let index = 0;

        function typeWriter() {
            if (index < text.length) {
                if (text.charAt(index) === '<') {
                    typingTitle.innerHTML += '<br>';
                    index += 4;
                } else {
                    typingTitle.innerHTML += text.charAt(index);
                    index++;
                }
                setTimeout(typeWriter, 40);
            }
        }
        typeWriter();
    }

    const bioModal = document.getElementById('bioModal');
    const imageModal = document.getElementById('imageModal');
    const modalBody = document.getElementById('modalBody');
    const modalImage = document.getElementById('modalImage');
    const bioButtons = document.querySelectorAll('.btn-bio');
    const teamImages = document.querySelectorAll('.team-card img');

    if (bioModal && modalBody) {
        bioButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const name = e.target.getAttribute('data-name');
                const bio = e.target.getAttribute('data-bio');
                modalBody.innerHTML = `<h3>${name}</h3><p class="mt-3">${bio}</p>`;
                const modal = new bootstrap.Modal(bioModal);
                modal.show();
            });
        });
    }

    if (imageModal && modalImage) {
        teamImages.forEach(img => {
            img.addEventListener('click', (e) => {
                modalImage.src = e.target.src;
                const modal = new bootstrap.Modal(imageModal);
                modal.show();
            });
        });
    }

    const navLinks = document.querySelectorAll('.nav-link');
    
    // Get current page full path for comparison
    const currentPath = window.location.pathname;
    
    // First, remove all active classes from all nav links
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Then add active class to the correct link based on current page
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        
        try {
            const linkPath = new URL(linkHref, window.location.href).pathname;
            
            // Check for exact match
            if (currentPath === linkPath) {
                link.classList.add('active');
            }
            // Special case: handle root index.html (home page)
            else if ((currentPath === '/' || currentPath === '/index.html') && 
                     (linkPath === '/' || linkPath === '/index.html')) {
                link.classList.add('active');
            }
        } catch (e) {
            // Fallback for any URL parsing errors
        }
    });

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section, .team-card, .subsidiary-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.style.background = 'rgba(10, 10, 10, 0.98)';
            navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5)';
        } else {
            navbar.style.background = 'rgba(30, 30, 30, 0.95)';
            navbar.style.boxShadow = 'none';
        }
        
        lastScroll = currentScroll;
    });

    // Card Slider Functionality
    const sliderContainers = document.querySelectorAll('.slider-container');

    sliderContainers.forEach(container => {
        const wrapper = container.querySelector('.slider-wrapper');
        const scrollbar = container.querySelector('.slider-scrollbar');
        const thumb = container.querySelector('.slider-scrollbar-thumb');
        const track = container.querySelector('.slider-scrollbar-track');

        if (!wrapper || !scrollbar || !thumb || !track) return;

        // Calculate scrollable width
        const updateScrollbar = () => {
            const scrollWidth = wrapper.scrollWidth - wrapper.clientWidth;
            const thumbWidth = (wrapper.clientWidth / wrapper.scrollWidth) * track.clientWidth;
            
            thumb.style.width = `${Math.max(thumbWidth, 40)}px`;
            
            const scrollRatio = wrapper.scrollLeft / scrollWidth;
            const maxThumbPosition = track.clientWidth - thumb.clientWidth;
            thumb.style.left = `${scrollRatio * maxThumbPosition}px`;
        };

        // Initial update
        updateScrollbar();

        // Update on scroll
        wrapper.addEventListener('scroll', updateScrollbar);

        // Handle window resize
        window.addEventListener('resize', updateScrollbar);

        // Drag to scroll functionality
        let isDown = false;
        let startX;
        let scrollLeft;

        wrapper.addEventListener('mousedown', (e) => {
            isDown = true;
            wrapper.style.cursor = 'grabbing';
            startX = e.pageX - wrapper.offsetLeft;
            scrollLeft = wrapper.scrollLeft;
        });

        wrapper.addEventListener('mouseleave', () => {
            isDown = false;
            wrapper.style.cursor = 'grab';
        });

        wrapper.addEventListener('mouseup', () => {
            isDown = false;
            wrapper.style.cursor = 'grab';
        });

        wrapper.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - wrapper.offsetLeft;
            const walk = (x - startX) * 2;
            wrapper.scrollLeft = scrollLeft - walk;
        });

        // Scrollbar thumb drag
        let isThumbDown = false;
        let thumbStartX;
        let thumbStartLeft;

        thumb.addEventListener('mousedown', (e) => {
            isThumbDown = true;
            thumb.style.cursor = 'grabbing';
            thumbStartX = e.pageX;
            thumbStartLeft = parseInt(thumb.style.left || 0);
            e.preventDefault();
        });

        document.addEventListener('mouseup', () => {
            isThumbDown = false;
            if (thumb) thumb.style.cursor = 'pointer';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isThumbDown) return;
            
            const trackWidth = track.clientWidth - thumb.clientWidth;
            const deltaX = e.pageX - thumbStartX;
            let newLeft = thumbStartLeft + deltaX;
            
            // Clamp position
            newLeft = Math.max(0, Math.min(newLeft, trackWidth));
            
            thumb.style.left = `${newLeft}px`;
            
            // Sync with wrapper scroll
            const scrollRatio = newLeft / trackWidth;
            const maxScroll = wrapper.scrollWidth - wrapper.clientWidth;
            wrapper.scrollLeft = scrollRatio * maxScroll;
        });

        // Click on track to scroll
        track.addEventListener('click', (e) => {
            if (e.target === thumb) return;
            
            const rect = track.getBoundingClientRect();
            const clickPosition = (e.clientX - rect.left) / track.clientWidth;
            
            thumb.style.left = `${clickPosition * (track.clientWidth - thumb.clientWidth)}px`;
            
            const maxScroll = wrapper.scrollWidth - wrapper.clientWidth;
            wrapper.scrollLeft = clickPosition * maxScroll;
        });
    });

});
