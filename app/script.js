// Define global variables
let foodsInfo = [];
let color = 'black';

// Define text colors
const textColors = {
    red: "rgb(241, 47, 47)",
    green: "rgb(77, 250, 77)",
    blue: "rgb(74, 74, 243)",
    white: "white",
    black: "rgb(0, 0, 0)"
};

// Generate a random alphabetical ID
function generateAlphabeticalID(length) {
    let id = '';
    while (id.length < length) {
        id += Math.random().toString(36).replace(/[^a-z]/g, '');
    }
    return id.substring(0, length);
}

// Add item to either pantry or shopping list
function addItem(isShoppingList) {
    const quantityElement = document.getElementById('enter_quantity');
    const quantity = Number(quantityElement.value.trim());
    const foodElement = document.getElementById('enter_food');
    const food = foodElement.value.trim();

    if (!food) {
        throw new Error('Please enter a food item');
    }

    const itemList = document.getElementById('itemlist');
    const items = itemList.querySelectorAll('li .item-name');
    let found = false;

    const updatedFoods = [...foodsInfo];

    items.forEach((item, idx) => {
        const quantityElm = itemList.querySelector(`#${item.parentElement.id} .item-quantity`);
        if (item.innerText === food) {
            found = true;
            quantityElm.innerText = Number(quantityElm.innerText) + quantity;
        }
        const obj = {
            name: item.innerText,
            quantity: Number(quantityElm.innerText),
        };
        if (!isShoppingList) {
            obj.expiry = itemList.querySelectorAll('li .expiry-date')[idx].value;
        }
        updatedFoods.push(obj);
    });

    if (!found) {
        const obj = {
            name: food,
            quantity,
            expiry: isShoppingList ? null : document.querySelector('.expiry-date').value,
        };
        updatedFoods.push(obj);
    }

    foodsInfo = updatedFoods;
    const saveTo = isShoppingList ? 'shopping_list' : 'pantry_items';
    localStorage.setItem(saveTo, JSON.stringify(foodsInfo));
    updateUser();

    if (found) return;

    const newItem = document.createElement('li');
    newItem.id = generateAlphabeticalID(10);

    newItem.innerHTML = `
        <span class="item-quantity">${quantity}</span>
        <span class="item-name">${food}</span>
    `;

    if (!isShoppingList) {
        newItem.innerHTML += `
            <input type="date" class="expiry-date">
            <button class="remove-item">Remove</button>
            <button class="clear-expiry">Clear Expiry</button>
        `;
        const expiryDateInput = newItem.querySelector('.expiry-date');
        expiryDateInput.addEventListener('change', () => {
            const date = expiryDateInput.value;
            for (const foodObj of foodsInfo) {
                if (foodObj.name === food) {
                    foodObj.expiry = date;
                    break;
                }
            }
            localStorage.setItem('pantry_items', JSON.stringify(foodsInfo));
            updateUser();
        });
    } else {
        newItem.querySelectorAll('.item-quantity, .item-name').forEach((element) => {
            element.style.color = textColors[color];
        });
    }

    itemList.appendChild(newItem);
}

// Remove item from list
function removeItem(button) {
    button.parentElement.remove();
    const name = button.parentElement.querySelector('.item-name').innerText;
    const updatedFoods = foodsInfo.filter((item) => item.name !== name);
    foodsInfo = updatedFoods;
    localStorage.setItem('pantry_items', JSON.stringify(foodsInfo));
    updateUser();
}

// Clear expiry date of an item
function clearExpiry(button) {
    const expiryInput = button.parentElement.querySelector('.expiry-date');
    expiryInput.value = '';
    const name = button.parentElement.querySelector('.item-name').innerText;
    const updatedFoods = foodsInfo.map((item) => {
        if (item.name === name) {
            item.expiry = null;
        }
        return item;
    });
    foodsInfo = updatedFoods;
    localStorage.setItem('pantry_items', JSON.stringify(foodsInfo));
    updateUser();
}

// Handle key events for header input
function headerKey(header) {
    return (e) => {
        const keyCode = e.code || e.key;
        if (keyCode !== 'Enter') {
            return;
        }
        const newHeader = document.createElement('span');
        newHeader.classList.add('finished-header');
        newHeader.innerText = header.value;
        header.replaceWith(newHeader);
    };
}

// Add header to list
function addHeader() {
    const header = document.createElement('input');
    header.type = 'text';
    header.placeholder = 'Type your header/title here!';
    header.classList.add('list_header');
    const list = document.getElementById('itemlist');
    const br = document.createElement('br');
    list.appendChild(header);
    list.appendChild(br);

    header.addEventListener('keypress', headerKey(header));
}

// Toggle light mode
document.getElementById('mode-toggle-checkbox').addEventListener('change', function() {
    document.body.classList.toggle('light-mode', this.checked);
});

// User login
function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const token = localStorage.getItem('token');

    if (token) {
        fetch(`http://localhost:3000/api/users/${token}/`)
            .then((response) => response.json())
            .then((response) => {
                localStorage.setItem('pantry_items', JSON.stringify(response.pantry_items));
                localStorage.setItem('shopping_list', JSON.stringify(response.shopping_list));
            });
    } else {
        fetch(`http://localhost:3000/api/users/getByEmail/${email}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ password })
        })
            .then(response => response.json())
            .then((response) => {
                localStorage.setItem('pantry_items', JSON.stringify(response.pantry_items));
                localStorage.setItem('shopping_list', JSON.stringify(response.shopping_list));
                localStorage.setItem('token', JSON.stringify(response.token));
            });
    }
}

// User logout
function logout() {
    localStorage.setItem('token', '');
}

// Sign up user
function signup() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const items = JSON.parse(localStorage.getItem('pantry_items')) || [];
    const shoppingList = JSON.parse(localStorage.getItem('shopping_list')) || [];

    fetch(`http://localhost:3000/api/users/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email,
            password,
            pantry_items: items,
            shopping_list: shoppingList
        })
    })
        .then((response) => response.text())
        .then((response) => {
            localStorage.setItem('token', response);
        });
}

// Update user data
function updateUser() {
    const token = localStorage.getItem('token');
    const items = JSON.parse(localStorage.getItem('pantry_items'));
    const shoppingList = JSON.parse(localStorage.getItem('shopping_list'));

    fetch(`http://localhost:3000/api/users/${token}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            pantry_items: items,
            shopping_list: shoppingList
        })
    })
        .then((response) => response.text())
        .then((response) => {
            console.log(response);
        });
}

// Send chat prompt
function chat() {
    const chatPrompt = document.getElementById('enter_prompt').value;
    fetch(`http://localhost:3000/api/chat/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            prompt: chatPrompt
        })
    })
        .then((response) => response.text())
        .then((text) => {
            const chatbotOutput = document.getElementById('Chatbot-Output');
            chatbotOutput.innerText += '\n____________________\n' + text;
        });
}

// Change text color
function colorChange(colorElm) {
    const colors = document.querySelectorAll('.color-item');
    colors.forEach((color) => {
        color.classList.remove('selected-color');
    });
    colorElm.classList.add('selected-color');
    color = colorElm.id;
}
