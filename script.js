let attributePoints = 6;
const pointsDisplay = document.getElementById("points-count");
const summaryList = document.getElementById("selected-attributes");
const finalSummaryList = document.getElementById('final-selected-attributes');
const finalSummaryList2 = document.getElementById('final-selected-attributes2');
const finalOrigin = document.getElementById('selected-origin');
const startNode = document.getElementById("start-node");

let selectedAttributes = {}; // Track selected attributes by type and value (e.g., { attack: '1% strength' })
let selectedOrigin = ''; // Track the selected origin
let originsData = { // Pros and cons for each origin
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

// Initialize nodes
const nodes = document.querySelectorAll('.node');
nodes.forEach(node => node.addEventListener('click', selectNode));

let gameStarted = false;

// Start game when clicking "Start" button
startNode.addEventListener('click', startGame);

function startGame() {
    if (gameStarted) return;
    gameStarted = true;

    startNode.classList.add('start'); // Disable interaction with Start button

    // Reveal the first layer of nodes
    const firstLayerNodes = document.querySelectorAll('.branch .node:nth-child(1)');
    firstLayerNodes.forEach(node => {
        node.classList.remove('hidden');
        node.style.opacity = 1;
    });
}

function selectNode(event) {
    const node = event.target;

    if (!gameStarted) return;

    // Check if the node is already selected
    if (node.classList.contains('selected')) {
        // Before unselecting, check if any child nodes are selected
        const nextNode = getNextNode(node);
        if (nextNode && nextNode.classList.contains('selected')) {
            alert('You cannot unselect this node because its child node is selected.');
            return; // Prevent unselection if the child is selected
        }

        // Unselect the node
        node.classList.remove('selected');
        attributePoints++;
        if (pointsDisplay) pointsDisplay.textContent = attributePoints;

        // Update summary by removing the deselected attribute and fallback to parent data if available
        removeFromSummary(node);

        // Hide the next node
        if (nextNode) {
            nextNode.classList.add('hidden');
            nextNode.style.opacity = 0;
        }

        return; // Exit the function since we're unselecting
    }

    // Handle selection logic as before
    const prevNode = getPreviousNode(node);
    if (prevNode && !prevNode.classList.contains('selected')) {
        alert('You must select the previous node first!');
        return;
    }

    if (attributePoints <= 0) {
        alert('Not enough points!');
        return;
    }

    node.classList.add('selected');
    attributePoints--;
    if (pointsDisplay) pointsDisplay.textContent = attributePoints;

    // Update the summary and reveal the next node
    updateSummary(node);

    const nextNodeToShow = getNextNode(node);
    if (nextNodeToShow) {
        nextNodeToShow.classList.remove('hidden');
        nextNodeToShow.style.opacity = 1;
    }
}

function getPreviousNode(node) {
    const path = node.parentElement;
    const nodesInPath = path.querySelectorAll('.node');
    const index = Array.from(nodesInPath).indexOf(node);
    if (index > 0) {
        return nodesInPath[index - 1];
    }
    return null;
}

function getNextNode(node) {
    const path = node.parentElement;
    const nodesInPath = path.querySelectorAll('.node');
    const index = Array.from(nodesInPath).indexOf(node);
    if (index < nodesInPath.length - 1) {
        return nodesInPath[index + 1];
    }
    return null;
}

// Updated function to track and show only the highest selected attribute
function updateSummary(node) {
    const attributeName = node.getAttribute('data-tooltip');
    const attributeType = node.getAttribute('data-attribute').replace(/\d+$/, ''); // Remove the number (e.g., attack1 -> attack)

    // Dynamically determine the value (e.g., 1% strength, 2% strength) based on node index
    const path = node.parentElement;
    const nodesInPath = Array.from(path.querySelectorAll('.node'));
    const index = nodesInPath.indexOf(node) + 1; // Index starts from 1, for 1% strength, 2%, etc.
    const attributeValue = `${index}% ${attributeType}`;

    // Update selectedAttributes object
    if (!selectedAttributes[attributeType] || selectedAttributes[attributeType] !== attributeValue) {
        selectedAttributes[attributeType] = attributeValue;
    }

    // Clear the summary list and re-add the highest selected attributes
    refreshSummaryDisplay();
}

// Function to remove unselected attribute from summary and fall back to previous node data
function removeFromSummary(node) {
    const attributeType = node.getAttribute('data-attribute').replace(/\d+$/, ''); // Remove the number (e.g., attack1 -> attack)

    // Remove the current attribute value
    delete selectedAttributes[attributeType];

    // If the parent node is selected, fall back to its attribute value
    const prevNode = getPreviousNode(node);
    if (prevNode && prevNode.classList.contains('selected')) {
        const path = prevNode.parentElement;
        const nodesInPath = Array.from(path.querySelectorAll('.node'));
        const prevIndex = nodesInPath.indexOf(prevNode) + 1; // Calculate the strength based on the parent node's index
        const fallbackValue = `${prevIndex}% ${attributeType}`;
        selectedAttributes[attributeType] = fallbackValue; // Restore parent node's value
    }

    // Refresh the summary display after updating attributes
    refreshSummaryDisplay();
}

// Function to refresh the summary list with selected attributes
function refreshSummaryDisplay() {
    // Clear summary and final summary lists before adding the new data
    if (summaryList) summaryList.innerHTML = '';
    if (finalSummaryList) finalSummaryList.innerHTML = '';
    if (finalSummaryList2) finalSummaryList2.innerHTML = '';

    // Loop over selected attributes and update both summary lists
    for (let key in selectedAttributes) {
        const listItem = document.createElement("li");
        listItem.textContent = selectedAttributes[key];

        // Append to the current page summary
        if (summaryList) summaryList.appendChild(listItem);

        // Append to finalSummaryList
        const finalListItem = document.createElement("li");
        finalListItem.textContent = selectedAttributes[key];
        if (finalSummaryList) finalSummaryList.appendChild(finalListItem); // Add to final summary

        // Append to finalSummaryList2
        const finalListItem2 = document.createElement("li");
        finalListItem2.textContent = selectedAttributes[key];
        if (finalSummaryList2) finalSummaryList2.appendChild(finalListItem2); // Add to final summary 2
    }
}

// Origin selection
const originSelections = document.querySelectorAll('.origin');

originSelections.forEach(origin => {
    origin.addEventListener('click', (e) => {
        // Remove the class from any previously selected origin
        const previouslySelected = document.querySelector('.origin.orgpicked');
        if (previouslySelected) {
            previouslySelected.classList.remove('orgpicked');
        }

        // Add the class to the newly selected origin
        const selectedOriginElement = e.target.closest('.origin');
        selectedOriginElement.classList.add('orgpicked');

        // Update the selectedOrigin variable
        selectedOrigin = selectedOriginElement.dataset.origin;

        // Update the origin summary display
        updateOriginSummary();
    });
});

function updateOriginSummary() {
    const originData = originsData[selectedOrigin];
    if (!originData) {
        console.error("No origin data found for:", selectedOrigin);
        return;
    }
    if (finalOrigin) {
        finalOrigin.innerHTML = `
            <h3>${originData.name}</h3>
            <p><strong>Pros:</strong> ${originData.pros}</p>
            <p><strong>Cons:</strong> ${originData.cons}</p>
        `;
    }
}

// Function to generate a text file with the selected attributes and origin
function generateTextFile() {
    let textContent = 'Selected Attributes:\n';

    // Add selected attributes from finalSummaryList ONLY
    if (finalSummaryList) {
        const listItems = finalSummaryList.querySelectorAll('li');
        listItems.forEach(item => {
            textContent += `${item.textContent}\n`;
        });
    }

    // Add selected origin
    if (selectedOrigin) {
        const originData = originsData[selectedOrigin];
        textContent += `\nChosen Origin: ${originData.name}\n`;
        textContent += `Pros: ${originData.pros}\n`;
        textContent += `Cons: ${originData.cons}\n`;
    }

    // Create a Blob with the text content
    const blob = new Blob([textContent], { type: 'text/plain' });
    const link = document.createElement('a');
    
    // Create a URL for the Blob and trigger the download
    link.href = URL.createObjectURL(blob);
    link.download = 'selected_attributes.txt';
    link.click();
}

// Add an event listener for the "Download Summary" button
document.getElementById('download-button').addEventListener('click', generateTextFile);

// Override the default alert() function
window.alert = function(message) {
    Toastify({
        text: message,
        duration: 3000, // Show for 3 seconds
        close: true, // Display close button
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        background: "linear-gradient(to right, #00b09b, #96c93d)",
        stopOnFocus: true, // Stop when focused
    }).showToast();
}