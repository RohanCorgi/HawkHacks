const bcrypt = require('bcrypt');
const saltRounds = 10

/**
 * @param {String} password 
 */
async function encryptPassword(password) {
    try {
        const salt = await bcrypt.genSalt(saltRounds)
        console.log('Salt:', salt)
        const hash = await bcrypt.hash(password, salt)
        console.log('Hash:', hash)
        return hash
    } catch (err){
        console.error(err)
    }
    
}

/**
 * @param {String} password
 * @param {String} hash
 * @returns {Boolean}
 */
async function comparePassword(password, hash) {
    try {
        const match = await bcrypt.compare(password, hash)
        console.log(password, hash, match)
        return match    
    } catch (err) {
        console.error(err)
    }
}

module.exports = {
    encryptPassword,
    comparePassword
}