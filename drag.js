const container = document.getElementById('container');
const skillTree = document.getElementById('skill-tree');
const toggleButton = document.getElementById('toggle-button');
let isDragging = false;
let startX, startY;
let offsetX = 0, offsetY = 0;
let zoomLevel = 1; // Initial zoom level
let isExpanded = false; // Toggle state for expand/shrink

// Center the skill tree on the "Start" button when the page loads
window.onload = function() {
    centerOnStart();
};

function centerOnStart() {
    const centerX = container.clientWidth / 2 - skillTree.clientWidth / 2;
    const centerY = container.clientHeight / 2 - skillTree.clientHeight / 2;
    offsetX = centerX;
    offsetY = centerY;
    skillTree.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${zoomLevel})`;
}

// Drag to move the skill tree
container.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX - offsetX;
    startY = e.clientY - offsetY;
});

container.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();

    offsetX = e.clientX - startX;
    offsetY = e.clientY - startY;
    skillTree.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${zoomLevel})`;
});

container.addEventListener('mouseup', () => {
    isDragging = false;
});

container.addEventListener('mouseleave', () => {
    isDragging = false;
});

// Zoom in/out with scroll
container.addEventListener('wheel', (e) => {
    e.preventDefault();

    const zoomIntensity = 0.1;
    if (e.deltaY < 0) {
        // Scroll up: Zoom in
        zoomLevel = Math.min(zoomLevel + zoomIntensity, 2); // Max zoom level
    } else {
        // Scroll down: Zoom out
        zoomLevel = Math.max(zoomLevel - zoomIntensity, 0.5); // Min zoom level
    }

    skillTree.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${zoomLevel})`;
});

// Toggle expand/shrink functionality
toggleButton.addEventListener('click', () => {
    if (!isExpanded) {
        container.style.width = "80vw";
        container.style.height = "80vh";
        toggleButton.style.backgroundImage = 'url("assets/img/Shrinkicon.png")';
    } else {
        container.style.width = "50vw";
        container.style.height = "50vh";
        toggleButton.style.backgroundImage = 'url("assets/img/Expandicon.png")';
    }
    isExpanded = !isExpanded;
});