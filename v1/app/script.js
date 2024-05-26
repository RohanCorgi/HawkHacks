var foods_info = []
var color = 'black'
let text_colors = {
    red: "rgb(241, 47, 47)",
    green: "rgb(77, 250, 77)",
    blue: "rgb(74, 74, 243)",
    white: "white",
    black: "rgb(0, 0, 0)"
}

function generateAlphabeticalID(length) {
    let id = '';
    while (id.length < length) {
        id += Math.random().toString(36).replace(/[^a-z]/g, '');
    }
    return id.substring(0, length);
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
        const quantity_elm = document.querySelector(`#${v.parentElement.id} .item-quantity`);
        if (v.innerText == food) {
            ret = true;
            quantity_elm.innerText = Number(quantity_elm.innerText) + quantity
        }
        let obj = {
            name: v.innerText,
            quantity: Number(quantity_elm.innerText),
        }
        if (!is_shopping_list) {
            obj.expiry = document.querySelectorAll('#itemlist li .expiry-date')[idx].value
        }
        foods.push(obj)
        console.log(foods)
    })
    if (!ret) {
        let obj = {
            name: food,
            quantity: quantity,
        }
        if (!is_shopping_list) {
            obj.expiry = null
        }
        foods.push(obj)
    }
    foods_info = foods
    let save_to = 'pantry_items'
    if (is_shopping_list) save_to = 'shopping_list'
    localStorage.setItem(save_to, JSON.stringify(foods_info))
    updateUser()
    if (ret) return;

    const newItem = document.createElement('li');
    newItem.id = generateAlphabeticalID(10);  // Generate unique ID

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
        ` // dont delete this line
        // Update expiry date span on item addition (optional)
        const expiryDateInput = newItem.querySelector('.expiry-date');
        expiryDateInput.addEventListener('change', () => {
            const date = document.getElementById(`expiry_date_${newItem.id}`).value;
            for (let i = 0; i < foods_info.length; i++) {
                if (foods_info[i]["name"] == food) {
                    console.log(date)
                    foods_info[i]["expiry"] = date
                    break
                }
            }
            localStorage.setItem('pantry_items', JSON.stringify(foods_info))
            updateUser()
        });
    } else {
        newItem.querySelectorAll('.item-quantity, .item-name').forEach((e) => {
            e.style.color = text_colors[color]
        })
    }

    itemList.appendChild(newItem);
}

function removeItem(button) {
    button.parentElement.remove();
    let name = button.parentElement.querySelector('.item-name').innerText
    console.log(name)
    for (let i = 0; i < foods_info.length; i++) {
        if (foods_info[i].name === name) {
            foods_info.splice(i, 1);
            break
        }
    }
    localStorage.setItem('pantry_items', JSON.stringify(foods_info))
    updateUser()
}

function clearExpiry(button) {
    const expiryInput = button.parentElement.querySelector('.expiry-date');
    expiryInput.value = "";
    let name = button.parentElement.querySelector('.item-name').innerText
    for (let i = 0; i < foods_info.length; i++) {
        if (foods_info[i].name === name) {
            foods_info[i].expiry = null
            break
        }
    }
    localStorage.setItem('pantry_items', JSON.stringify(foods_info))
    updateUser()
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
            localStorage.setItem('pantry_items',JSON.stringify(response.pantry_items))
            localStorage.setItem('shopping_list',JSON.stringify(response.shopping_list))
        })
    } else {
        fetch(`http://localhost:3000/api/users/getByEmail/${email}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({password: password})
        })
        .then(response => (response.json()))
        .then((response) => {
            localStorage.setItem('pantry_items',JSON.stringify(response.pantry_items))
            localStorage.setItem('shopping_list',JSON.stringify(response.shopping_list))
            localStorage.setItem('token',JSON.stringify(response.token))
        })
    }
}

function logout() {
    localStorage.setItem('token', '')
}

function storageToList (){
    pantry_items = localStorage.getItem('pantry_items')
    shopping_list = localStorage.getItem('shopping_list')


}

function signup() {
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    var items = JSON.parse(localStorage.getItem('pantry_items'))
    var shopping_list = JSON.parse(localStorage.getItem('shopping_list'))

    fetch(`http://localhost:3000/api/users/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email,
            password: password,
            pantry_items: items || [],
            shopping_list: shopping_list || [] //Get a list with objects
        })
    })
    .then((response) => response.text())
    .then((response) => {
        localStorage.setItem('token', response)
    })
}

function updateUser() {
    var token = localStorage.getItem('token')
    var items = JSON.parse(localStorage.getItem('pantry_items'))
    var shopping_list = JSON.parse(localStorage.getItem('shopping_list'))

    fetch(`http://localhost:3000/api/users/${token}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            pantry_items: items,
            shopping_list: shopping_list
        })
    })
    .then((response) => (response.text()))
    .then((response) => {
        console.log(response)
    })
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