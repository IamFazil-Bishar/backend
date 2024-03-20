import User from "../models/User.js"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// user registration
export const register = async(req,res)=>{
    try{

        // hashing password
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(req.body.password,  salt)

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hash,
            photo: req.body.photo,
        })

        await newUser.save()

        res.status(200).json({success:true, message:'Successfully created'})

    }catch(err){

        res.status(500).json({success:false, message:'failed to create. try again'})
        
    }
}
// user login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        // if user doesn't exist
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // compare passwords
        const checkCorrectPassword = await bcrypt.compare(password, user.password);

        // if the password is incorrect
        if (!checkCorrectPassword) {
            return res.status(401).json({ success: false, message: "Incorrect email or password" });
        }

        const { password: userPassword, role, ...rest } = user._doc;

        // create jwt token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "15d" }
        );

        // set token in the browser cookies and send the response to the client
        res.cookie('accessToken', token, {
            httpOnly: true,
            expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days in milliseconds
        }).status(200).json({ success: true, message: 'Successfully login', token , data: { ...rest }, role });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to login" });
    }
};