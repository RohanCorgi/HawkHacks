var foods_info = []

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

function addHeader() {
    let header = document.createElement('input')
    header.type = 'text'
    header.placeholder = 'type your header/title here!'
    header.classList.add('list_header')
    let list = document.getElementById('itemlist')
    let br = document.createElement('br')
    list.appendChild(header)
    list.appendChild(br)
}

document.getElementById('mode-toggle-checkbox').addEventListener('change', function() {
    document.body.classList.toggle('light-mode', this.checked);
});

function login() {
    let email = document.getElementById('email').value
    let password = document.getElementById('password').value
    let token = localStorage.getItem('token')
    console.log('login', email, password)

    fetch(`http://localhost:3000/users/${token}`).then((response) => {
        if (response.ok) {
            var items = response.items
            localStorage.setItem('items', items)
        } else {
            alert('There was an error getting your login')
        }
    })
}

function signup() {
    let email = document.getElementById('email').value
    let password = document.getElementById('password').value
    console.log('signup', email, password)

    fetch(`http://localhost:3000/users`, {
        method: "POST",
        body: {
            email: email,
            password: password,
            items: [] //Get a list with objects
        }
    })

}

