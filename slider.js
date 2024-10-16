// Renamed 'origins' to 'pageOrigins' to avoid conflict with 'script.js'
const pageOrigins = document.querySelectorAll('.origin'); // Renamed from 'origins'
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');

// Show the first slide initially
slides[currentSlide].classList.add('active');

// Navigation buttons
const nextButton = document.getElementById('next-button');
const nextButton2 = document.getElementById('next-button2');
const prevButton = document.getElementById('prev-button');
const prevButton2 = document.getElementById('prev-button2');

// Navigate to the next slide
nextButton.addEventListener('click', () => {
    navigateToSlide(1);
});

nextButton2.addEventListener('click', () => {
    navigateToSlide(2);
});

// Navigate to the previous slide
prevButton.addEventListener('click', () => {
    navigateToSlide(0);
});

prevButton2.addEventListener('click', () => {
    navigateToSlide(1);
});

// Function to navigate between slides
function navigateToSlide(slideIndex) {
    slides[currentSlide].classList.remove('active');
    currentSlide = slideIndex;
    slides[currentSlide].classList.add('active');
}

// Handle origin selection
pageOrigins.forEach(origin => {
    origin.addEventListener('click', (e) => {
        const selectedOrigin = e.target.closest('.origin').dataset.origin;
        updateOriginSummary(selectedOrigin);
    });
});

// Function to update the final summary with the selected origin
function updateOriginSummary(selectedOrigin) {
    const originData = {
        warrior: {
            name: "Warrior",
            pros: "High Strength, Increased Attack",
            cons: "Low Speed, Vulnerable to Magic"
        },
        mage: {
            name: "Mage",
            pros: "Powerful Spells, High Mana",
            cons: "Weak Defense, Low Health"
        }
    };

    const finalOriginElement = document.getElementById('selected-origin');
    if (originData[selectedOrigin]) {
        finalOriginElement.innerHTML = `
            <h3>${originData[selectedOrigin].name}</h3>
            <p><strong>Pros:</strong> ${originData[selectedOrigin].pros}</p>
            <p><strong>Cons:</strong> ${originData[selectedOrigin].cons}</p>
        `;
    } else {
        console.error("Origin data not found for:", selectedOrigin);
    }
}