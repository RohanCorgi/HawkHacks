function addItem() {
    try {
        const quantityElement = document.getElementById('enter_quantity');
        const quantity = Number(quantityElement.value.trim());
        const foodElement = document.getElementById('enter_food');
        const food = foodElement.value.trim();

        if (food === '') {
            throw new Error('Please enter a food item');
        }

        const itemList = document.getElementById('itemlist');
        const newItem = document.createElement('li');
        newItem.id = Math.random().toString(36).substring(2, 15);  // Generate unique ID

        // Constructing the list item HTML
        newItem.innerHTML = `
            <span class="item-quantity">${quantity}</span>
            <span class="item-name">${plural(food, quantity)}</span>
        `;

        // Update expiry date span on item addition (optional)
    

        itemList.appendChild(newItem);
    } catch (error) {
        console.error('Error adding item:', error.message);
    }
}


document.getElementById('mode-toggle-checkbox').addEventListener('change', function() {
    document.body.classList.toggle('light-mode', this.checked);
});

// Pluralize function
function plural(word, count) {
    return count === 1 ? word : word + 's';
}
