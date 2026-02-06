document.addEventListener('DOMContentLoaded', () => {

    // --- Navbar Toggle ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if(hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // --- Modal Logic ---
    const modal = document.getElementById('bioModal');
    const imageModal = document.getElementById('imageModal');
    const closeModal = document.querySelectorAll('.close-modal');
    const modalBody = document.getElementById('modalBody');
    const modalImage = document.getElementById('modalImage');
    const bioButtons = document.querySelectorAll('.btn-bio');
    const teamImages = document.querySelectorAll('.team-card img');

    if(modal) {
        // Open Bio Modal
        bioButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const name = e.target.getAttribute('data-name');
                const bio = e.target.getAttribute('data-bio');

                // Populate Modal
                modalBody.innerHTML = `<h3>${name}</h3><br><p>${bio}</p>`;
                modal.style.display = 'flex';
            });
        });
    }

    if(imageModal && modalImage) {
        console.log('Image modal elements found');
        console.log('Team images found:', teamImages.length);
        // Open Image Modal
        teamImages.forEach(img => {
            img.addEventListener('click', (e) => {
                console.log('Image clicked:', e.target.src);
                const imgSrc = e.target.src;
                modalImage.src = imgSrc;
                imageModal.style.display = 'flex';
            });
        });
    } else {
        console.log('Image modal elements not found');
    }

    // Close Modals
    closeModal.forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            imageModal.style.display = 'none';
        });
    });

    // Close on outside click
    window.addEventListener('click', (e) => {
        if (e.target == modal) {
            modal.style.display = 'none';
        }
        if (e.target == imageModal) {
            imageModal.style.display = 'none';
        }
    });

    // --- Typing Animation ---
    const typingTitle = document.getElementById('typing-title');
    const text = "Satu Imajinasi,<br>Seribu Kenyataan.";
    let index = 0;

    function typeWriter() {
        if (index < text.length) {
            if (text.charAt(index) === '<') {
                typingTitle.innerHTML += '<br>';
                index += 4; // Skip <br>
            } else {
                typingTitle.innerHTML += text.charAt(index);
                index++;
            }
            setTimeout(typeWriter, 40);
        }
    }

    typeWriter();

    // --- Carousel Functionality ---
    const carouselInner = document.querySelector('.carousel-inner');
    const carouselItems = document.querySelectorAll('.carousel-item');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    let currentIndex = 0;

    function showSlide(index) {
        carouselItems.forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % carouselItems.length;
        showSlide(currentIndex);
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + carouselItems.length) % carouselItems.length;
        showSlide(currentIndex);
    }

    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // Auto-slide every 3 seconds
    setInterval(nextSlide, 3000);

    // --- Team Slider Functionality ---
    const sliderContainers = document.querySelectorAll('.team-slider-container');

    sliderContainers.forEach(container => {
        const slider = container.querySelector('.team-slider');
        const prevBtn = container.querySelector('.slider-prev');
        const nextBtn = container.querySelector('.slider-next');

        const scrollAmount = 368; // Fixed: 18rem (288px) + padding (48px) + gap (32px)

        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Prev button clicked');
                if (slider.scrollLeft > 0) {
                    slider.scrollLeft -= scrollAmount;
                }
            });

            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Next button clicked');
                if (slider.scrollLeft < slider.scrollWidth - slider.clientWidth) {
                    slider.scrollLeft += scrollAmount;
                }
            });
        }
    });

    // --- Scroll Animation ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.section, .team-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});
