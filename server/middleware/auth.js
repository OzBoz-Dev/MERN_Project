const jwt = require('jsonwebtoken')

// verifies JWT from the authorization header
const auth = (req, res, next) => {
    const header = req.headers.authorization

    if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'could not authorize, token not provided' })
    }

    const token = header.split(' ')[1]

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded // id, iat, exp
        next()
    } catch (err) {
        return res.status(401).json({ error: 'invalid or expired token' })
    }
}

module.exports = auth
