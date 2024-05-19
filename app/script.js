var foods_info = []
var color = 'black'
let text_colors = {
    red: "rgb(241, 47, 47)",
    green: "rgb(77, 250, 77)",
    blue: "rgb(74, 74, 243)",
    white: "white",
    black: "rgb(0, 0, 0)"
}

function addItem(is_shopping_list) {
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
    let foods = []
    items.forEach((v, idx) => {
        if (v.innerText == food) {
            ret = true;
            var quant = document.querySelectorAll('#itemlist li .item-quantity')[idx]
            quant.innerText = Number(quant.innerText) + quantity
        }
        if (!is_shopping_list) {
            foods.push({
                name: v.innerText,
                quantity: Number(document.querySelectorAll('#itemlist li .item-quantity')[idx].value),
                exipry: document.querySelectorAll('#itemlist li .expiry-date')[idx].value
            })
            let a = document.querySelector('#itemlist li .expiry-date')
            console.log(a.value)
        }
    })
    if (ret) return;
    foods_info = foods

    const newItem = document.createElement('li');
    newItem.id = Math.random().toString(36).substring(2, 15);  // Generate unique ID

    // Constructing the list item HTML
    newItem.innerHTML = `
        <span class="item-quantity">${quantity}</span>
        <span class="item-name">${food}</span>
    `;

    if (!is_shopping_list) {
        newItem.innerHTML += `
            <input type="date" id="expiry_date_${newItem.id}" class="expiry-date">
            <button class="remove-item" onclick="removeItem(this)">Remove</button>
            <button class="clear-expiry" onclick="clearExpiry(this)">Clear Expiry</button>
        `
        // Update expiry date span on item addition (optional)
        const expiryDateInput = newItem.querySelector('.expiry-date');
        expiryDateInput.addEventListener('change', function() {
            const date = this.value;
            // TODO: Make it update the expiry date in real time
        });
        // TODO: Make it save to local storage
    } else {
        newItem.querySelectorAll('.item-quantity, .item-name').forEach((e) => {
            e.style.color = text_colors[color]
        })
    }

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

function removeItem(button) {
    button.parentElement.remove();
}

/**
 * @param {HTMLInputElement} header
 */
function headerKey(header) {
    /**
     * @param {KeyboardEvent} e 
     * @returns 
     */
    function eventHandler(e) {
        var keyCode = e.code || e.key;
        if (keyCode !== 'Enter') {
            return;
        }
        let new_header = document.createElement('span')
        new_header.classList.add('finished-header')
        new_header.innerText = header.value
        header.replaceWith(new_header)
    }
    return eventHandler
}

function addHeader() {
    let header = document.createElement('input')
    header.type = 'text'
    header.placeholder = 'type your header/title here!'
    header.classList.add('list_header')
    let list = document.getElementById('itemlist')
    let br = document.createElement('br')
    list.appendChild(header)
    list.appendChild(br)

    header.addEventListener('keypress', headerKey(header))
}

document.getElementById('mode-toggle-checkbox').addEventListener('change', function() {
    document.body.classList.toggle('light-mode', this.checked);
});

function login() {
    let email = document.getElementById('email').value
    let password = document.getElementById('password').value
    let token = localStorage.getItem('token')
    console.log('login', email, password, token)

    if (token) {
        fetch(`http://localhost:3000/api/users/${token}/`)
        .then((response) => (response.json()))
        .then((response) => {
            localStorage.setItem('items',response.items)
        })
    } else {

    }
}

function signup() {
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    fetch(`http://localhost:3000/api/users/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email,
            password: password,
            items: [] //Get a list with objects
        })
    })
    .then((response) => response.text())
    .then((response) => {
        localStorage.setItem('token', response)
    })
}

function updateUser() {
    var token = localStorage.getItem('token')

}

function chat() {
    var chat_prompt = document.getElementById('enter_prompt').value
    console.log(chat_prompt)
    fetch(`http://localhost:3000/api/chat/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            prompt: chat_prompt
        })
    })
    .then((response) => (response.text()))
    .then((text) => document.getElementById('Chatbot-Output').innerText+='\n____________________\n'+text)
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