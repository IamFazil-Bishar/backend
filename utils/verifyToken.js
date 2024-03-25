import jwt from 'jsonwebtoken';

// Middleware to verify the JWT token
export const verifyToken = (req, res, next) => {
    const token = req.cookies.accessToken ? '\x1b[32mTrue\x1b[0m' : '\x1b[31mFalse\x1b[0m';
    console.log(`\x1b[1m\x1b[37m[${new Date().toLocaleTimeString([], {hour12: false, hourCycle: 'h23'})}] \x1b[1m\x1b[33m[Server] [Debug]\x1b[0m - Path: ${req.path} - Method: ${req.method} - Body: ${JSON.stringify(req.body)} - Access Token: ${accessToken}`);
   

    console.log(req.cookies)

    // Check if token exists
    if (!token) {
        return res.status(401).json({ success: false, message: "You are not authorized , not found token" });
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(401).json({ success: false, message: "Token is invalid" });
        }
        req.user = user;
        next();  // Proceed to the next middleware
    });
};

// Middleware to verify user authentication
export const verifyUser = (req, res, next) => {
    // Call verifyToken middleware to verify the token first
    verifyToken(req, res, () => {
        // Check if user ID matches the request parameter ID or if the user is an admin
        if (req.user.id === req.params.id || req.user.role === 'admin') {
            next(); // Proceed to the next middleware
        } else {
            return res.status(403).json({ success: false, message: "You are not authenticated" });
        }
    });
};

// Middleware to verify admin authorization
export const verifyAdmin = (req, res, next) => {
    // Call verifyToken middleware to verify the token first
    verifyToken(req, res, () => {
        // Check if the user is an admin
        if (req.user.role === 'admin') {
            next(); // Proceed to the next middleware
        } else {
            return res.status(403).json({ success: false, message: "You are not authorized" });
        }
    });
};




// export const verifyToken = (req, res, next) => {
//     const token = req.cookies.accessToken;

//     console.log(req.cookies)

//     // Check if token exists
//     if (!token) {
//         return res.status(401).json({ success: false, message: "You are not authorized , not found token" });
//     }

//     // Verify the token
//     jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
//         if (err) {
//             return res.status(401).json({ success: false, message: "Token is invalid" });
//         }
//         req.user = user;
//         next();  // Proceed to the next middleware
//     });
// };