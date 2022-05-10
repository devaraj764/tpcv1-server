const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    const token = req.setHeader('auth-token');
    if (!token) return res.status(401).send('Access Denied');;

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.userid = verified;
        next()
    } catch (err) { res.status(400).send('Invalid Token') }
}