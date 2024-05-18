function addItem() {
    const quantityElement = document.getElementById('enter_quantity');
    const quantity = Number(quantityElement.value.trim());
    const foodElement = document.getElementById('enter_food');
    const food = foodElement.value.trim();

    if (food === '') {
        throw new Error('Please enter a food item');
    }

    const itemList = document.getElementById('itemlist');

    const items = document.querySelectorAll('#itemlist li .item-name')
    let ret = false;
    items.forEach((v, idx) => {
        if (v.innerText == food) {
            ret = true;
            let quant = document.querySelectorAll('#itemlist li .item-quantity')[idx]
            quant.innerText = Number(quant.innerText) + quantity
        }
    })
    if (ret) return;

    const newItem = document.createElement('li');
    newItem.id = Math.random().toString(36).substring(2, 15);  // Generate unique ID

    // Constructing the list item HTML
    newItem.innerHTML = `
        <span class="item-quantity">${quantity}</span>
        <span class="item-name">${food}</span>
        <input type="date" id="expiry_date_${newItem.id}" class="expiry-date">
        <button class="remove-item" onclick="removeItem(this)">Remove</button>
        <button class="clear-expiry" onclick="clearExpiry(this)">Clear Expiry</button>
    `;

    // Update expiry date span on item addition (optional)
    const expiryDateInput = newItem.querySelector('.expiry-date');
    expiryDateInput.addEventListener('change', function() {
        const expirySpan = this.parentElement.querySelector('.item-expiry');
        expirySpan.textContent = this.value;
    });

    itemList.appendChild(newItem);
}

function removeItem(button) {
    button.parentElement.remove();
}

function clearExpiry(button) {
  const expiryInput = button.parentElement.querySelector('.expiry-date');
  const expirySpan = button.parentElement.querySelector('.item-expiry');
  expiryInput.value = "";
  expirySpan.textContent = "";
}

document.getElementById('mode-toggle-checkbox').addEventListener('change', function() {
    document.body.classList.toggle('light-mode', this.checked);
});

// Pluralize function
function plural(word, count) {
    return count === 1 ? word : word + 's';
}
