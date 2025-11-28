const User = require("../models/UsersModels");
const jwt = require("jsonwebtoken");
const Depertment = require("../models/DepertmentModel");
const HeadAnDepartment = require("../models/HeadAnDepartment");
const Employee = require("../models/EmployeeModel")

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
            message: ' logged in successfully',
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
        console.error('Error logging in :', error);
        res.status(500).json({
            message: `Internal Server Error Or ${error.message}`,
            success: false
        });
    }
};

// Create Depertment
exports.createDepartment = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                success: false,
                message: "Please Provide UserId"
            })
        }

        const { DepartmentName } = req.body;
        if (!DepartmentName) {
            return res.status(200).json({
                success: false,
                message: "Please Provide DepartmentName"
            })
        }

        // create Department
        const newDepartment = new Depertment({
            DepartmentName,
        });

        await newDepartment.save();

        return res.status(200).json({
            success: true,
            message: "Department Created SuccessFully"
        })

    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error in createDepartment"
        })
    }
};

// fetch All Department
exports.fetchAllDepartment = async (req, res) => {
    try {
        //No Need for userId;

        const allDepartment = await Depertment.find({});
        if (allDepartment.length === 0) {
            return res.status(200).json({
                success: false,
                message: "No data found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Fetched All Department SuccessFully",
            count: allDepartment.length,
            allDepartment,
        })

    } catch (error) {
        console.error('Error fetchAllDepartment:', error);
        res.status(500).json({
            message: `Internal Server Error Or ${error.message}`,
            success: false
        });
    }
};


// this for any one Department Head create logic
exports.createHeadADepartment = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                success: false,
                message: "Please Provide userId"
            })
        };

        const { DepartmentHeadName, email, mobile, DepartmentName } = req.body;
        if (!DepartmentHeadName || !DepartmentName || !email || !mobile) {
            return res.status(200).json({
                success: false,
                message: "Please Provide DepartmentHeadName and DepartmentName or email or mobile"
            })
        };

        //find Department on basis of DepartmentName
        const findDepartment = await Depertment.findOne({ DepartmentName });

        if (!findDepartment) {
            return res.status(200).json({
                success: false,
                message: "No Depertment Found"
            })
        };

        // Create Head
        const newHead = new HeadAnDepartment({
            departmentId: findDepartment._id,
            DepartmentHeadName,
            DepartmentName,
            email,
            mobile
        })

        await newHead.save();

        // also save in user Collections
        await User.create({
            userName: DepartmentHeadName,
            email,
            password: mobile,
            role: DepartmentName,
            headDepartmentId:newHead._id,
        })

        return res.status(200).json({
            success: true,
            message: " HeadADepartment Create Successfully",
        })

    } catch (error) {
        console.error('Error createHeadADepartment:', error);
        res.status(500).json({
            message: `Internal Server Error Or ${error.message}`,
            success: false
        });
    }
};

// fetch all Head Department list
exports.fetchAllHeadDepartment = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                success: false,
                message: "Please Provide userId"
            })
        };


        // fetc All HeadDepartment list
        const head = await HeadAnDepartment.find({});

        if (head.length === 0) {
            return res.status(200).json({
                success: false,
                message: "No data found"
            })
        }

        return res.status(200).json({
            success: true,
            message: " HeadADepartment Fetched Successfully",
            head,
        })

    } catch (error) {
        console.error('Error fetchAllHeadDepartment:', error);
        res.status(500).json({
            message: `Internal Server Error Or ${error.message}`,
            success: false
        });
    }
}


// Add Employee Logic
exports.addEmployee = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                success: false,
                message: "Please Provide UserId",
            })
        }

        const { empName, empEmail, empMobile, } = req.body;

        if (!empName || !empEmail || !empMobile) {
            return res.status(200).json({
                success: false,
                message: "please Provide empName or empEmail or empMobile"
            })
        }

        // create employee 
        const emp = new Employee({
            departmentHeadId
        })

    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error in addEmployee"
        })
    }
}