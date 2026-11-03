// ========== Cookie Popup Management ==========

document.addEventListener('DOMContentLoaded', function() {
    // Проверяем, было ли уже сделано согласие на cookies
    const cookieConsent = localStorage.getItem('cookieConsent');
    const cookiePopup = document.querySelector('.cookie-popup');
    
    // Если pop-up существует и согласие не было дано, показываем pop-up
    if (cookiePopup && !cookieConsent) {
        // Добавляем небольшую задержку для плавного появления
        setTimeout(() => {
            cookiePopup.classList.add('show');
        }, 1000);
    }
    
    // Обработка кнопки "Принять"
    const acceptBtn = document.querySelector('.cookie-accept');
    if (acceptBtn) {
        acceptBtn.addEventListener('click', function() {
            localStorage.setItem('cookieConsent', 'accepted');
            cookiePopup.classList.remove('show');
        });
    }
    
    // Обработка кнопки "Отклонить"
    const declineBtn = document.querySelector('.cookie-decline');
    if (declineBtn) {
        declineBtn.addEventListener('click', function() {
            localStorage.setItem('cookieConsent', 'declined');
            cookiePopup.classList.remove('show');
        });
    }
});

// ========== Mobile Menu Toggle ==========
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
        });
    }
});

// ========== Search Form Tabs ==========
document.addEventListener('DOMContentLoaded', function() {
    const searchTabs = document.querySelectorAll('.search-tab');
    searchTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Удаляем активный класс со всех вкладок
            searchTabs.forEach(t => t.classList.remove('active'));
            // Добавляем активный класс к выбранной вкладке
            this.classList.add('active');
        });
    });
});

// ========== Property Search Form ==========
document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Здесь можно добавить логику поиска
            document.querySelector('.properties-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }
});

// ========== Hero Slider ==========
let currentSlide = 0;
const slides = document.querySelectorAll('.hero-slide');

function changeSlide(direction) {
    if (slides.length === 0) return;
    
    currentSlide += direction;
    
    if (currentSlide >= slides.length) {
        currentSlide = 0;
    } else if (currentSlide < 0) {
        currentSlide = slides.length - 1;
    }
    
    updateSlider();
}

function goToSlide(index) {
    currentSlide = index - 1;
    updateSlider();
}

function updateSlider() {
    if (slides.length === 0) return;
    
    slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === currentSlide);
    });
    
    const dots = document.querySelectorAll('.dot-hero');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

// Автоматическая смена слайдов
document.addEventListener('DOMContentLoaded', function() {
    if (slides.length > 0) {
        setInterval(() => {
            changeSlide(1);
        }, 5000);
    }
});

// ========== Testimonials Slider ==========
let currentTestimonial = 0;
const testimonials = document.querySelectorAll('.testimonial-item');

function showTestimonial(index) {
    if (testimonials.length === 0) return;
    
    testimonials.forEach((testimonial, i) => {
        testimonial.classList.toggle('active', i === index);
    });
    
    const dots = document.querySelectorAll('.dot-testimonial');
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

window.currentTestimonial = function(index) {
    currentTestimonial = index - 1;
    showTestimonial(currentTestimonial);
};

// Автоматическая смена отзывов
document.addEventListener('DOMContentLoaded', function() {
    if (testimonials.length > 0) {
        setInterval(() => {
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            showTestimonial(currentTestimonial);
        }, 6000);
    }
});

// ========== Process Accordion ==========
document.addEventListener('DOMContentLoaded', function() {
    const accordionItems = document.querySelectorAll('.process-accordion-item');
    
    accordionItems.forEach(item => {
        const header = item.querySelector('.process-accordion-header');
        if (header) {
            header.addEventListener('click', function() {
                // Закрываем все остальные элементы
                accordionItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                // Переключаем текущий элемент
                item.classList.toggle('active');
            });
        }
    });
});

// ========== FAQ Accordion ==========
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const header = item.querySelector('.faq-header');
        if (header) {
            header.addEventListener('click', function() {
                // Закрываем все остальные элементы FAQ
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                // Переключаем текущий элемент
                item.classList.toggle('active');
            });
        }
    });
});

// ========== Stats Counter Animation ==========
document.addEventListener('DOMContentLoaded', function() {
    const stats = document.querySelectorAll('.stat-number');
    
    const animateStats = () => {
        stats.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            if (!target) return;
            
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            
            const updateStat = () => {
                current += increment;
                if (current < target) {
                    stat.textContent = Math.floor(current) + '+';
                    requestAnimationFrame(updateStat);
                } else {
                    stat.textContent = target + '+';
                }
            };
            
            // Запускаем анимацию при прокрутке к секции
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !stat.classList.contains('animated')) {
                        stat.classList.add('animated');
                        updateStat();
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(stat);
        });
    };
    
    animateStats();
});

// ========== Current Year Update ==========
document.addEventListener('DOMContentLoaded', function() {
    const yearElements = document.querySelectorAll('.current-year');
    const currentYear = new Date().getFullYear();
    yearElements.forEach(el => {
        el.textContent = currentYear;
    });
});



