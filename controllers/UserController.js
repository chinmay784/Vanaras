const User = require("../models/UsersModels");
const jwt = require("jsonwebtoken");
const Depertment = require("../models/DepertmentModel");
const HeadAnDepartment = require("../models/HeadAnDepartment");
const Employee = require("../models/EmployeeModel");
const AssignWork = require("../models/AssignWorkModel")

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
            });
        }

        const { DepartmentHeadName, email, mobile, DepartmentName } = req.body;

        if (!DepartmentHeadName || !DepartmentName || !email || !mobile) {
            return res.status(200).json({
                success: false,
                message: "Please Provide DepartmentHeadName, DepartmentName, email & mobile"
            });
        }

        // 🔎 Step 1: Check Department spelling corrected
        const findDepartment = await Depertment.findOne({ DepartmentName });

        if (!findDepartment) {
            return res.status(200).json({
                success: false,
                message: "No Department Found"
            });
        }

        // ❗ Step 2: Prevent duplicate Head
        const existingHead = await HeadAnDepartment.findOne({ email });
        if (existingHead) {
            return res.status(200).json({
                success: false,
                message: "This Head is already created"
            });
        }

        // Step 3: Create new Head
        const newHead = await HeadAnDepartment.create({
            departmentId: findDepartment._id,
            DepartmentHeadName,
            DepartmentName,
            email,
            mobile
        });

        // Step 4: Create User for Head
        const newUser = await User.create({
            userName: DepartmentHeadName,
            email,
            password: mobile, // ❗ replace with hashed password if needed
            role: DepartmentName,
            headDepartmentId: newHead._id,
        });

        // Step 5: Push user into Department people list + save
        findDepartment.people.push(newUser._id);
        await findDepartment.save();

        return res.status(200).json({
            success: true,
            message: "Head of Department Created Successfully",
        });

    } catch (error) {
        console.error('Error createHeadADepartment:', error);
        res.status(500).json({
            success: false,
            message: `Internal Server Error: ${error.message}`,
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

        const use = await User.findById(userId);

        const { empName, empEmail, empMobile, } = req.body;

        if (!empName || !empEmail || !empMobile) {
            return res.status(200).json({
                success: false,
                message: "please Provide empName or empEmail or empMobile"
            })
        }

        // create employee 
        const emp = new Employee({
            departmentHeadId: userId,
            empName,
            empEmail,
            empMobile,
        })

        await emp.save();

        // Save in userCollections
        const newUser = await User.create({
            userName: empName,
            email: empEmail,
            password: empMobile,
            role: use.role,
            employeeId: emp._id,
        });

        const user = await User.findById(userId);

        // also find in department
        const dept = await Depertment.findOne({ DepartmentName: user.role });

        if (!dept) {
            return res.status(200).json({
                success: false,
                message: "deptarment Not Found"
            })
        }

        // 📌 Step 4: Add employee (userId) to department people list
        dept.people.push(newUser._id);
        await dept.save();


        return res.status(200).json({
            success: true,
            message: "Employee added Successfully"
        })

    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error in addEmployee"
        })
    }
};

// fetch all employee List
exports.fetchAllEmployee = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                success: false,
                message: "Please Provide UserId",
            })
        }

        // find in userCollections
        const user = await User.findById(userId);
        if (!user) {
            return res.status(200).json({
                success: false,
                message: "User Not Found",
            })
        }

        // find in employee collections
        const emp = await Employee.find({ departmentHeadId: userId });
        if (emp.length === 0) {
            return res.status(200).json({
                success: false,
                message: " No Data Found",
            })
        }

        return res.status(200).json({
            success: true,
            message: "Fetched SuccessFully",
            emp,
        })

    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error in fetchAllEmployee"
        })
    }
}


// Assign work to Employee
exports.AssignWorkToEmployee = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                success: false,
                message: "Please Provide UserId",
            });
        }

        const { workTitel, workDescription, empId } = req.body;

        if (!workTitel || !workDescription || !empId) {
            return res.status(200).json({
                success: false,
                message: "Please Provide workTitel, workDescription, empId",
            });
        }

        // 🔍 Check employee exist
        const employee = await Employee.findById(empId);
        if (!employee) {
            return res.status(200).json({
                success: false,
                message: "Employee Not Found",
            });
        }

        // 📌 Step 1: Create work assign entry
        const workAssign = await AssignWork.create({
            workTitel,
            workDescription,
            workAssignToId: empId,
        });

        // 📌 Step 2: Push assigned work ID into employee model
        employee.assignWork.push(workAssign._id);
        await employee.save();

        return res.status(200).json({
            success: true,
            message: "Work Assigned Successfully",
            data: workAssign
        });

    } catch (error) {
        console.log("AssignWorkToEmployee Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error in AssignWorkToEmployee",
        });
    }
};



