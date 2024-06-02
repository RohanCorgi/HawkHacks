function loginByToken() {
    let token = localStorage.getItem('token')
    if (token) {
        fetch(`http://localhost:8080/api/users/${token}`)
        .then((response) => (response.json()))
        .then((response) => {
            if (response.message == 'Successful') {
                localStorage.setItem('pantry_items', JSON.stringify(response.content.pantry_items))
                localStorage.setItem('shopping_list', JSON.stringify(response.content.shopping_list))
            }
        })
    }
}

function login() {
    let email = document.getElementById('email').value
    let password = document.getElementById('password').value
    fetch(`http://localhost:8080/api/users/getByEmail/${email}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({password: password})
        })
        .then(response => (response.json()))
        .then((response) => {
            alert(response.message)
            if (response.message == 'Successful') {
                localStorage.setItem('pantry_items',JSON.stringify(response.content.pantry_items))
                localStorage.setItem('shopping_list',JSON.stringify(response.content.shopping_list))
                localStorage.setItem('token',response.content.token)
                document.getElementById('login').style.display = "none";
                document.getElementById('signup').style.display = "none";
                document.getElementById('logout').style.display = "block";
            }
            
        })
}

function logout() {
    localStorage.setItem('token', '')
    document.getElementById('login').style.display = "block";
    document.getElementById('signup').style.display = "block";
    document.getElementById('logout').style.display = "none";
    alert('Successfully logged out')
}

function signup() {
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    var items = JSON.parse(localStorage.getItem('pantry_items'))
    var shopping_list = JSON.parse(localStorage.getItem('shopping_list'))

    fetch(`http://localhost:8080/api/users/`, {
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
    .then((response) => response.json())
    .then((response) => {
        console.log(response)
        if (response.message == 'Successful') {
            localStorage.setItem('token', response.content.token)
            document.getElementById('login').style.display = "none";
            document.getElementById('signup').style.display = "none";
            document.getElementById('logout').style.display = "block";
        }
    })
}

function updateUser() {
    var token = localStorage.getItem('token')
    var items = JSON.parse(localStorage.getItem('pantry_items'))
    var shopping_list = JSON.parse(localStorage.getItem('shopping_list'))

    fetch(`http://localhost:8080/api/users/${token}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            pantry_items: items,
            shopping_list: shopping_list
        })
    })
    .then((response) => (response.json()))
    .then((response) => {
        console.log(response.message)
    })
}

function chat() {
    var chat_prompt = document.getElementById('enter_prompt').value
    console.log(chat_prompt)
    fetch(`http://localhost:8080/api/chat/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            prompt: chat_prompt
        })
    })
    .then((response) => (response.json()))
    .then((response) => {
        if (response.message == "Successful") {
            document.getElementById('Chatbot-Output').innerText+='\n____________________\n'+response.content.choices[0].message.content
        } else {
            alert(response.message)
        }
    })
}