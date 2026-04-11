(function ($) {
    "use strict";

    // Custom Cursor
    const cursorDot = document.querySelector(".cursor-dot");
    const cursorOutline = document.querySelector(".cursor-outline");

    window.addEventListener("mousemove", function (e) {
        const posX = e.clientX;
        const posY = e.clientY;

        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // cursorOutline.style.left = `${posX}px`;
        // cursorOutline.style.top = `${posY}px`;

        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    // Magnetic Buttons
    const magneticBtns = document.querySelectorAll('.magnetic-btn');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', function (e) {
            const position = btn.getBoundingClientRect();
            const x = e.clientX - position.left - position.width / 2;
            const y = e.clientY - position.top - position.height / 2;

            btn.style.transform = `translate(${x * 0.15}px, ${y * 0.25}px)`;
            cursorOutline.style.transform = `translate(-50%, -50%) scale(1.5)`;
            cursorOutline.style.borderColor = 'white';
        });

        btn.addEventListener('mouseleave', function () {
            btn.style.transform = 'translate(0px, 0px)';
            cursorOutline.style.transform = `translate(-50%, -50%) scale(1)`;
            cursorOutline.style.borderColor = '#D4AF37';
        });
    });

    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 45) {
            $('.nav-bar').addClass('nav-sticky');
        } else {
            $('.nav-bar').removeClass('nav-sticky');
        }
    });

    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 200) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
        return false;
    });

    // Smooth scrolling for navigation links
    $('a[href^="#"]:not([href="#"])').on('click', function (e) {
        var target = this.hash;
        if (target) {
            e.preventDefault();
            $('html, body').stop().animate({
                scrollTop: $(target).offset().top - 70 // Offset for fixed navbar
            }, 800, 'easeInOutExpo');

            // Update active link
            $('.nav-link').removeClass('active');
            $(this).addClass('active');

            // Close mobile menu if open
            if ($('.navbar-collapse').hasClass('show')) {
                $('.navbar-collapse').collapse('hide');
            }
        }
    });

    // Service carousel
    $(".service-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        margin: 25,
        loop: true,
        center: false,
        dots: false,
        nav: true,
        navText: [
            '<i class="fa fa-chevron-left"></i>',
            '<i class="fa fa-chevron-right"></i>'
        ],
        responsive: {
            0: {
                items: 1
            },
            768: {
                items: 2
            },
            992: {
                items: 3
            }
        }
    });

    // Scroll Reveal Animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                if (entry.target.dataset.reveal === 'left') {
                    entry.target.classList.add('fadeInLeft');
                } else if (entry.target.dataset.reveal === 'right') {
                    entry.target.classList.add('fadeInRight');
                } else {
                    entry.target.classList.add('fadeInUp');
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('[data-reveal], .service-card, .project-card, .blog-post').forEach(el => {
        el.style.opacity = '0';
        el.classList.add('animated'); // Using the library classes
        observer.observe(el);
    });

    // Tilt Effect (Simplified)
    document.querySelectorAll('[data-tilt]').forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const { left, top, width, height } = el.getBoundingClientRect();
            const x = (e.clientX - left) / width - 0.5;
            const y = (e.clientY - top) / height - 0.5;
            el.style.transform = `perspective(1000px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-10px)`;
        });
        el.addEventListener('mouseleave', () => {
            el.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateY(0px)';
        });
    });

    // Contact Form "Other" Specify Logic
    $('#interest-select').on('change', function () {
        if ($(this).val() === 'other') {
            $('#specify-group').slideDown();
        } else {
            $('#specify-group').slideUp();
        }
    });

    // Preloader Logic
    $(window).on('load', function () {
        const preloader = $('#preloader');
        if (!preloader.length) return;

        const isReload = performance.getEntriesByType("navigation")[0]?.type === "reload";

        if (sessionStorage.getItem('preloaderShown') && !isReload) {
            preloader.remove();
            $('body').removeClass('overflow-hidden');
            handleHashScroll();
            return;
        }

        initBinaryRain();
        setTimeout(function () {
            preloader.fadeOut('slow', function () {
                $(this).remove();
                $('body').removeClass('overflow-hidden');
                sessionStorage.setItem('preloaderShown', 'true');
                handleHashScroll();
            });
        }, 4000); 
    });

    function handleHashScroll() {
        if (window.location.hash) {
            var target = window.location.hash;
            if ($(target).length) {
                $('html, body').stop().animate({
                    scrollTop: $(target).offset().top - 70
                }, 1000, 'easeInOutExpo');
            }
        }
    }

    function initBinaryRain() {
        const canvas = document.getElementById('binary-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const binary = "01";
        const fontSize = 16;
        const columns = canvas.width / fontSize;
        const drops = [];

        for (let x = 0; x < columns; x++) {
            drops[x] = 1;
        }

        function draw() {
            ctx.fillStyle = "rgba(0, 0, 0, 0.15)"; // Increased fade speed for clearer trails
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = "rgba(212, 175, 55, 0.5)"; // Slightly richer gold
            ctx.font = fontSize + "px Courier New";

            for (let i = 0; i < drops.length; i++) {
                const text = binary.charAt(Math.floor(Math.random() * binary.length));
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }

        const rainInterval = setInterval(draw, 70); // Slowed down from 33ms

        setTimeout(() => {
            clearInterval(rainInterval);
        }, 4500);
    }

})(jQuery);
