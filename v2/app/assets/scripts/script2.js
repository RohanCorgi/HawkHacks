function addItemToShoppingList(item) {
    const itemList = document.getElementById('itemlist');

    if (item) {
        const itemElement = document.createElement('li')
        itemElement.innerHTML = `
            <span class="item-quantity">${item.quantity}</span>
            <span class="item-name">${item.name}</span>
        `
    }
}

function addItemToPantry(item) {
    const itemList = document.getElementById('itemlist');

    if (item) { //The input item will usually come from localStorage
        const itemElement = document.createElement('li');
        itemElement.innerHTML = `
            <span class="item-quantity">${item.quantity}</span>
            <span class="item-name">${item.name}</span>
            <input type="date" class="expiry-date" onchange="updateExpiry(this)">
            <button class="remove-item" onclick="removeItemFromPantry(this)">Remove</button>
            <button class="clear-expiry" onclick="clearExpiryFromPantry(this)">Clear Expiry</button>
        `;

        if (item.expiry) {
            itemElement.querySelector('.expiry-date').value = item.expiry.slice(0, 10)
        }
        
        //expiryDateInput.addEventListener('change', updateExpiry(expiryDateInput, item))
        
        itemList.appendChild(itemElement)
    } else { //If not from localStorage, it will be from input
        const quantityElement = document.getElementById('enter_quantity');
        const quantity = Number(quantityElement.value.trim());
        const foodElement = document.getElementById('enter_food');
        const food = foodElement.value.trim();

        if (food === '') {
            alert('Please enter a food item');
            return;
        }

        //If the item already exists, just change the quantity else add the item to the list
        const listItemElements = [...document.querySelectorAll('.item-name')]
        const itemInList = listItemElements.find(i => i.outerText == food)
        if (itemInList) {
            const quantity_elm = itemInList.parentElement.querySelector(`.item-quantity`);
            quantity_elm.innerText = Number(quantity_elm.outerText) + quantity
            //update localStorage
            const foods_info = JSON.parse(localStorage.getItem('pantry_items'))
            foods_info.find(i => i.name === food).quantity = quantity_elm.innerText
            localStorage.setItem('pantry_items', JSON.stringify(foods_info))
            updateUser()
        } else {
            //Add item to list
            const newItem = document.createElement('li')
            newItem.innerHTML = `
                <span class="item-quantity">${quantity}</span>
                <span class="item-name">${food}</span>
                <input type="date" class="expiry-date" oninput="updateExpiry(this)">
                <button class="remove-item" onclick="removeItemFromPantry(this)">Remove</button>
                <button class="clear-expiry" onclick="clearExpiryFromPantry(this)">Clear Expiry</button>
            `
            //Add item to localStorage pantry_items
            const expiryDateInput = newItem.querySelector('.expiry-date')
            const item = {
                name: food,
                quantity: quantity,
                expiry: expiryDateInput.value
            }
            const foods_info = JSON.parse(localStorage.getItem('pantry_items'))
            foods_info.push(item)
            localStorage.setItem('pantry_items', JSON.stringify(foods_info))

            //expiryDateInput.addEventListener('change', updateExpiry(expiryDateInput, item))
            itemList.appendChild(newItem)

            //Send request to server
            updateUser()
        }
    }
}

/**
 * @param {HTMLButtonElement} button 
 */
function removeItemFromPantry(button) {
    let name = button.parentElement.querySelector('.item-name').innerText
    button.parentElement.remove();
    const pantry_items = JSON.parse(localStorage.getItem('pantry_items'))
    const item = pantry_items.find(i => i.name === name)
    const idx = pantry_items.indexOf(item)
    pantry_items.splice(idx, 1)
    localStorage.setItem('pantry_items', JSON.stringify(pantry_items))
    updateUser()
}

/**
 * @param {HTMLButtonElement} button 
 */
function clearExpiryFromPantry(button) {
    button.parentElement.querySelector('.expiry-date').value = "";
    let name = button.parentElement.querySelector('.item-name').innerText
    const pantry_items = JSON.parse(localStorage.getItem('pantry_items'))
    pantry_items.find(i => i.name === name).expiry = ""

    localStorage.setItem('pantry_items', JSON.stringify(pantry_items))
    updateUser()
}

/**
 * @param {HTMLInputElement} input 
 */
function updateExpiry(input) {
    const date = input.value;
    const name = input.parentElement.querySelector('.item-name').innerText
    const foods_info = JSON.parse(localStorage.getItem('pantry_items'))
    foods_info.find(i => i.name === name)["expiry"] = date
    localStorage.setItem('pantry_items', JSON.stringify(foods_info))
    updateUser()
}

/**
 * @param {HTMLLIElement} color_elm 
 */
function color_change(color_elm) {
    let colors = document.querySelectorAll('.color-item')
    colors.forEach((c) => {c.classList.remove('selected-color')})
    color_elm.classList.add('selected-color')
    color = color_elm.id
}

window.onload = function() {
    loginByToken()
    const pantry_items = localStorage.getItem('pantry_items')
    if (pantry_items) {
        for (const item of JSON.parse(pantry_items)) {
            addItemToPantry(item)
        }
    } else {
        localStorage.setItem('pantry_items', '[]')
    }
}