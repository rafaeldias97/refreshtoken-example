const router = require('express').Router();
const jwt = require('jsonwebtoken');
const { verifyToken, verifyRefreshToken } = require('../middlewares/auth.middleware');

const { JWT_SECRET, JWT_REFRESH_SECRET } = process.env;

router.get('/teste', verifyToken, (req, res) => {
    return res.json({ teste: true });
});

router.post('/auth', (req, res) => {
    const { username, password } = req.body;
    const refreshToken = jwt.sign({ username, password }, JWT_REFRESH_SECRET, { expiresIn: '1800s' });
    const token = jwt.sign({ refreshToken }, JWT_SECRET, { expiresIn: '20s' });
    return res.json({ token, refreshToken });
});

router.post('/refresh', verifyRefreshToken, (req, res) => {
    const { refreshToken } = req.body;
    const token = jwt.sign({ refreshToken }, JWT_SECRET, { expiresIn: '20s' });
    return res.json({ token });
});

module.exports = router;