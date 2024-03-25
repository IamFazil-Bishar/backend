import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const token = req.cookies.accessToken;

    console.log('token:', token); // Log the token for debugging

    if (!token) {
        return res.status(401).json({ success: false, message: "You are not authorized" });
    }

    // if the token exists, then verify the token
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) {
            console.error('JWT verification error:', err); // Log JWT verification error
            return res.status(401).json({ success: false, message: "Token is invalid" });
        }
        req.user = user;
        next();  // don't forget to call next
    });
};

export const verifyUser = (req, res, next) => {
    verifyToken(req, res, () => {
        console.log('User:', req.user); // Log the user object for debugging
        if (req.user.id === req.params.id || req.user.role === 'admin') {
            next();
        } else {
            return res.status(401).json({ success: false, message: "You are not authenticated" });
        }
    });
};

export const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        console.log('User:', req.user); // Log the user object for debugging
        if (req.user.role === 'admin') {
            next();
        } else {
            return res.status(401).json({ success: false, message: "You are not authorized" });
        }
    });
};
