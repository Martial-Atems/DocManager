
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');

function showSide(index) {
    slides[currentSlide].classList.remove('active');
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
}

function changeSlide(direction) {
    showSide(currentSlide + direction);
}

// Auto slide every 5 secondes
setInterval(() => {
    changeSlide(1);
}, 5000); 