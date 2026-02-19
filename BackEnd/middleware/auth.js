const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    console.error('❌ JWT_SECRET manquant dans .env');
    process.exit(1);
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"

    console.log('🔐 Auth Header:', authHeader ? 'PRÉSENT' : 'ABSENT');
    console.log('🔑 Token extrait:', token ? 'PRÉSENT' : 'ABSENT');

    if (!token) {
        return res.status(401).json({ error: 'Token manquant' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error('❌ Token invalide:', err.message);
            return res.status(401).json({ error: 'Token invalide' });
        }

        console.log('✅ User authentifié:', decoded.userId);
        
        // ⚠️ MISE EN PLACE DE req.userId (PAS req.user.userId)
        req.userId = decoded.userId;  // ← CORRECTION ICI
        
        next();
    });
}

module.exports = authenticateToken;
