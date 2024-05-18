/**
 * Returns the plural of an English word.
 *
 * @export
 * @param {string} word
 * @param {number} [amount]
 * @returns {string}
 */
function plural(word, amount) {
    if (amount !== undefined && amount === 1) {
        return word
    }
    const plural = {
        '(quiz)$'               : "$1zes",
        '^(ox)$'                : "$1en",
        '([m|l])ouse$'          : "$1ice",
        '(matr|vert|ind)ix|ex$' : "$1ices",
        '(x|ch|ss|sh)$'         : "$1es",
        '([^aeiouy]|qu)y$'      : "$1ies",
        '(hive)$'               : "$1s",
        '(?:([^f])fe|([lr])f)$' : "$1$2ves",
        '(shea|lea|loa|thie)f$' : "$1ves",
        'sis$'                  : "ses",
        '([ti])um$'             : "$1a",
        '(tomat|potat|ech|her|vet)o$': "$1oes",
        '(bu)s$'                : "$1ses",
        '(alias)$'              : "$1es",
        '(octop)us$'            : "$1i",
        '(ax|test)is$'          : "$1es",
        '(us)$'                 : "$1es",
        '([^s]+)$'              : "$1s"
    }
    const irregular = {
        'move'   : 'moves',
        'foot'   : 'feet',
        'goose'  : 'geese',
        'sex'    : 'sexes',
        'child'  : 'children',
        'man'    : 'men',
        'tooth'  : 'teeth',
        'person' : 'people'
    }
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
    ]
    // save some time in the case that singular and plural are the same
    if (uncountable.indexOf(word.toLowerCase()) >= 0) {
        return word
    }
    // check for irregular forms
    for (const w in irregular) {
        const pattern = new RegExp(`${w}$`, 'i')
        const replace = irregular[w]
        if (pattern.test(word)) {
            return word.replace(pattern, replace)
        }
    }
    // check for matches using regular expressions
    for (const reg in plural) {
        const pattern = new RegExp(reg, 'i')
        if (pattern.test(word)) {
            return word.replace(pattern, plural[reg])
        }
    }
    return word
}

function addItem() {
    const quantity_element = document.getElementById('enter_quantity')
    let quantity = Number(quantity_element.value.trim())
    const food_element = document.getElementById('enter_food')
    let food = food_element.value.trim()

    if (food === '') {
        alert('Please enter a food item')
    }

    /** @type {HTMLUListElement} */
    const item_list = document.getElementById('itemlist')
    const new_item = document.createElement('li')
    item_list.appendChild(new_item)

    new_item.innerHTML = `<span class="item-quantity">${quantity}</span> <span class="item-name">${plural(food, quantity)}</span>`
}