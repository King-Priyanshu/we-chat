const jwt = require('jsonwebtoken');

const jwtSecretKey = 'your_secret_key';

function verifyToken(req, res, next) {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({
            tokenNotFound: true,
            message: 'Token not found'
        });
    }

    try {
        const decoded = jwt.verify(token, jwtSecretKey);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.error('Error verifying token:', error.message);
        return res.status(401).json({
            tokenInvalid: true,
            message: 'Invalid token'
        });
    }
}

module.exports = verifyToken;
