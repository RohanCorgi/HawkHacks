function plural(word, amount) {
    if (amount !== undefined && amount === 1) {
        return word;
    }
    const plural = {
        '(quiz)$': "$1zes",
        '^(ox)$': "$1en",
        '([m|l])ouse$': "$1ice",
        '(matr|vert|ind)ix|ex$': "$1ices",
        '(x|ch|ss|sh)$': "$1es",
        '([^aeiouy]|qu)y$': "$1ies",
        '(hive)$': "$1s",
        '(?:([^f])fe|([lr])f)$': "$1$2ves",
        '(shea|lea|loa|thie)f$': "$1ves",
        'sis$': "ses",
        '([ti])um$': "$1a",
        '(tomat|potat|ech|her|vet)o$': "$1oes",
        '(bu)s$': "$1ses",
        '(alias)$': "$1es",
        '(octop)us$': "$1i",
        '(ax|test)is$': "$1es",
        '(us)$': "$1es",
        '([^s]+)$': "$1s"
    };
    const irregular = {
        'move': 'moves',
        'foot': 'feet',
        'goose': 'geese',
        'sex': 'sexes',
        'child': 'children',
        'man': 'men',
        'tooth': 'teeth',
        'person': 'people'
    };
    const uncountable = [
        'sheep',
        'fish',
        'deer',
        'moose',
        'series',
        'species',
        'money',
        'rice',
        'information',
        'equipment',
        'bison',
        'cod',
        'offspring',
        'pike',
        'salmon',
        'shrimp',
        'swine',
        'trout',
        'aircraft',
        'hovercraft',
        'spacecraft',
        'sugar',
        'tuna',
        'you',
        'wood'
    ];
    // save some time in the case that singular and plural are the same
    if (uncountable.indexOf(word.toLowerCase()) >= 0) {
        return word;
    }
    // check for irregular forms
    for (const w in irregular) {
        const pattern = new RegExp(`${w}$`, 'i');
        const replace = irregular[w];
        if (pattern.test(word)) {
            return word.replace(pattern, replace);
        }
    }
    // check for matches using regular expressions
    for (const reg in plural) {
        const pattern = new RegExp(reg, 'i');
        if (pattern.test(word)) {
            return word.replace(pattern, plural[reg]);
        }
    }
    return word;
}

function addItem() {
    const quantityElement = document.getElementById('enter_quantity');
    let quantity = Number(quantityElement.value.trim());
    const foodElement = document.getElementById('enter_food');
    let food = foodElement.value.trim();

    if (food === '') {
        alert('Please enter a food item');
    }

    const itemList = document.getElementById('itemlist');
    const newItem = document.createElement('li');
    itemList.appendChild(newItem);

    newItem.innerHTML = `<span class="item-quantity">${quantity}</span> <span class="item-name">${plural(food, quantity)}</span>`;
}

function addShoppingItem() {
    const quantityElement = document.getElementById('enter_quantity_shopping');
    let quantity = Number(quantityElement.value.trim());
    const foodElement = document.getElementById('enter_food_shopping');
    let food = foodElement.value.trim();

    if (food === '') {
        alert('Please enter a food item');
    }

    const itemList = document.getElementById('shoppingitemlist');
    const newItem = document.createElement('li');
    itemList.appendChild(newItem);

    newItem.innerHTML = `<span class="item-quantity">${quantity}</span> <span class="item-name">${plural(food, quantity)}</span>`;
}

document.getElementById('mode-toggle-checkbox').addEventListener('change', function() {
    document.body.classList.toggle('light-mode', this.checked);
});

document.getElementById('open-shopping-list').addEventListener('click', function() {
    const shoppingListContainer = document.getElementById('shopping-list');
    shoppingListContainer.style.display = shoppingListContainer.style.display === 'none' ? 'flex' : 'none';
});
