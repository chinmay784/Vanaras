const User = require("../models/UsersModels");
const jwt = require("jsonwebtoken")

exports.createSuperAdmin = async (req, res) => {
    try {
        const { userName, email, password } = req.body;

        if (!userName || !email || !password) {
            return res.status(200).json({
                success: false,
                message: "Please Provide UserName or Password or email"
            })
        };

        const newUser = new User({
            userName,
            email,
            password,
            role: "superadmin"
        });

        await newUser.save();

        return res.status(200).json({
            success: true,
            message: "SuperAdmin Register SuccessFully"
        })

    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error in createSuperAdmin"
        })
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required',
                success: false
            });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(200).json({
                message: 'Super admin not found',
                success: false
            });
        }

        // Check password (in a real application, you should hash the password and compare)
        if (user.password !== password) {
            return res.status(401).json({
                message: 'Invalid password',
                success: false
            });
        }

        const token = jwt.sign({ userId: user._id }, "Vanaras", { expiresIn: "24h" })

        res.status(200).json({
            message: 'Super admin logged in successfully',
            success: true,
            user: {
                id: user._id,
                name: user.userName,
                email: user.email,
                role: user.role
            },
            token,
        });

    } catch (error) {
        console.error('Error logging in super admin:', error);
        res.status(500).json({
            message: `Internal Server Error Or ${error.message}`,
            success: false
        });
    }
}