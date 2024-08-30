const jsonwebtoken = require('jsonwebtoken')
const secret = 'secretshop12345'
const JWT = {
    generate(value, expires) {
        return jsonwebtoken.sign(value, secret,
            {
                expiresIn: expires
            })
    },
    verify(token) {
        try {
            return jsonwebtoken.verify(token, secret)
        }
        catch(err) {
            return false
        }
    }
}

module.exports = JWT