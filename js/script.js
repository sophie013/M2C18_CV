$(document).ready(function() {
    "use strict";

    // --- 1. Cursor Personalizado con detección de Táctil ---
    const cursor = document.getElementById('cursor');
    const isTouchDevice = () => {
        return (('ontouchstart' in window) || (navigator.maxTouchPoints > 0));
    };

    if (cursor && !isTouchDevice()) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            cursor.style.display = 'block';
        });
    } else if (cursor) {
        cursor.style.display = 'none';
    }

    // --- 2. Toggle Sidebar Móvil ---
    $('.header-toggle').on('click', function() {
        $('body').toggleClass('header-show');
        $(this).toggleClass('bi-list bi-x');
    });

    // --- 3. Efecto de Escritura (Typed.js) ---
    if ($('.typed').length) {
        let typed_strings = $('.typed').data('typed-items');
        typed_strings = typed_strings.split(',');
        new Typed('.typed', {
            strings: typed_strings,
            loop: true,
            typeSpeed: 70,
            backSpeed: 40,
            backDelay: 2000
        });
    }

    // --- 4. Cambio de Tema ---
    $('#theme-toggle').on('click', function() {
        const html = $('html');
        const isDark = html.attr('data-bs-theme') === 'dark';
        html.attr('data-bs-theme', isDark ? 'light' : 'dark');
        $(this).find('i').toggleClass('bi-moon-stars-fill bi-sun-fill');
        $(this).toggleClass('btn-outline-info btn-info');
    });

    // --- 5. Soft Scroll (Desplazamiento Suave) ---
    $('a[href^="#"]').on('click', function(e) {
        let target = $(this.getAttribute('href'));
        if (target.length) {
            e.preventDefault();
            $('html, body').stop().animate({
                scrollTop: target.offset().top - 15
            }, 800);

            // Cerrar menú móvil al hacer clic
            if ($('body').hasClass('header-show')) {
                $('body').removeClass('header-show');
                $('.header-toggle').addClass('bi-list').removeClass('bi-x');
            }
        }
    });

    // --- 6. VALIDACIÓN EN TIEMPO REAL ---
    const nombreRegex = /^[a-zA-ZÀ-ÿ\s']+$/; 
    const emailRegex = /^[^\s@]+@[^\s@]+\.(com|cl)$/;

    function validarCampo(selector, regex = null) {
        const $campo = $(selector);
        const valor = $campo.val().trim();
        let esValido = true;

        if (valor === "") {
            esValido = false;
        } else if (regex && !regex.test(valor)) {
            esValido = false;
        }

        if (esValido) {
            $campo.addClass('is-valid').removeClass('is-invalid');
        } else {
            $campo.addClass('is-invalid').removeClass('is-valid');
        }
        return esValido;
    }

    // Eventos 'input' para validación instantánea
    $('#nombre').on('input', function() { validarCampo(this, nombreRegex); });
    $('#email').on('input', function() { validarCampo(this, emailRegex); });
    $('#asunto, #mensaje').on('input', function() { validarCampo(this); });

    // Envío del Formulario
    $('#contactForm').on('submit', function(e) {
        e.preventDefault();
        
        const isNombreValid = validarCampo('#nombre', nombreRegex);
        const isEmailValid = validarCampo('#email', emailRegex);
        const isAsuntoValid = validarCampo('#asunto');
        const isMensajeValid = validarCampo('#mensaje');

        if (isNombreValid && isEmailValid && isAsuntoValid && isMensajeValid) {
            $('#formError').addClass('d-none');
            $('#formSuccess').removeClass('d-none').hide().fadeIn();
            
            this.reset();
            $('.form-control').removeClass('is-valid is-invalid');
            
            setTimeout(() => { $('#formSuccess').fadeOut(); }, 5000);
        } else {
            $('#formSuccess').addClass('d-none');
            $('#formError').removeClass('d-none').hide().fadeIn();
        }
    });

    // --- 7. Navegación Activa (ScrollSpy) ---
    $(window).on('scroll', function() {
        let position = $(this).scrollTop() + 200;
        $('section').each(function() {
            let target = $(this).offset().top;
            let id = $(this).attr('id');
            if (position >= target) {
                $('#navmenu a').removeClass('active');
                $('#navmenu a[href="#' + id + '"]').addClass('active');
            }
        });
    });
});