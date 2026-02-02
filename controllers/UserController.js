const User = require("../models/UsersModels");
const jwt = require("jsonwebtoken");
const Depertment = require("../models/DepertmentModel");
const HeadAnDepartment = require("../models/HeadAnDepartment");
const Employee = require("../models/EmployeeModel");
const AssignWork = require("../models/AssignWorkModel");
const Product = require("../models/ProductModel");
const AddBarcodeIMEINo = require("../models/AddBarcodeIMEINoModel");
const SolderingModel = require("../models/SolderingModel");
const BatteryConnectionModel = require("../models/BatteryConnectionModel");
const FirmWareModel = require("../models/FirmWareModel");
const OcModel = require("../models/OcModel");


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
            role: `${use.role}-employee`,
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

        if (!workDescription || !workTitel || !empId) {
            return res.status(200).json({
                success: false,
                message: "Please Provide workDescription or workTitel or empId",
            });
        }

        // Create assign work
        const workAssign = await AssignWork.create({
            workTitel,
            workDescription,
            workAssignToId: empId,
            whoAssignWorkId: userId, // IMPORTANT FIX
        });

        // Push into employee.assignWork
        await Employee.findByIdAndUpdate(
            empId,
            { $push: { assignWork: workAssign._id } },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Work Assigned Successfully",
            workAssign,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Server Error in AssignWorkToEmployee",
        });
    }
};


// department Head Show Assign work Employee List
exports.epartment_Head_Show_Assign_work_Employee = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                success: false,
                message: "Please Provide UserId",
            });
        }

        // fetch AssignWork document list
        const assignWorkList = await AssignWork.find({ whoAssignWorkId: userId })
            .populate("workAssignToId", "empName empEmail empMobile");

        if (assignWorkList.length === 0) {
            return res.status(200).json({
                success: false,
                message: "No Data Found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Fetched SuccessFully",
            assignWorkList,
        })

    } catch (error) {
        console.log("epartment_Head_Show_Assign_work_Employee Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error in epartment_Head_Show_Assign_work_Employee",
        });
    }
}



// Login Employee Fetch Work List
exports.FetchLoginEmployeeWorkList = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                success: false,
                message: "Please Provide UserId",
            });
        }

        const user = await User.findById(userId);

        // also find in employee collections 
        const emp = await Employee.findById(user.employeeId)
            .populate({
                path: "assignWork",
                model: "AssignWork",
                populate: {
                    path: "whoAssignWorkId",
                    select: "DepartmentHeadName DepartmentName email mobile"
                }
            });

        if (!emp) {
            return res.status(200).json({
                success: false,
                message: "emp not Found"
            })
        };

        return res.status(200).json({
            success: true,
            message: "Fetched SuccessFully",
            emp,
        })

    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error in FetchLoginEmployeeWorkList"
        })
    }
}


// create Product By SuperAdmin
exports.createProduct = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                success: false,
                message: 'Please Provide UserId'
            })
        }

        const { productName, modelNo, partNo, TacNo, productType } = req.body;

        if (!productName || !modelNo || !partNo || !TacNo || !productType) {
            return res.status(200).json({
                success: false,
                message: 'Please Provide All Fields'
            })
        }

        // create Product
        const product = await Product.create({
            createdId: userId,
            productName,
            modelNo,
            partNo,
            TacNo,
            productType
        })

        return res.status(200).json({
            success: true,
            message: 'Product Created SuccessFully'
        })

    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error in createProduct"
        })
    }
}

// fetch Product 
exports.fetchProduct = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                success: false,
                message: 'Please Provide UserId'
            })
        }

        // fetch Product list

        const allProduct = await Product.find({});

        if (allProduct.length === 0) {
            return res.status(200).json({
                success: false,
                message: 'No Data Found'
            })
        }

        return res.status(200).json({
            success: true,
            message: "Fetched SuccessFully",
            allProduct
        })

    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error in createProduct"
        })
    }
}


// add Barcode or Scan Barcode
exports.addBarCode = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                success: false,
                message: 'Please Provide UserId'
            })
        }


        const { batchNo, lotNo, imeiNo } = req.body;

        if (!batchNo || !lotNo || !imeiNo) {
            return res.status(200).json({
                success: false,
                message: 'Please Provide batchNo, lotNo, imeiNo'
            })
        }

        // prevent duplicate imeiNo
        const existingEntry = await AddBarcodeIMEINo.findOne({ imeiNo });
        if (existingEntry) {
            return res.status(200).json({
                success: false,
                message: "This IMEI No is already added"
            });
        }


        // create addBarcodeIMEINo
        const addBarCode = await AddBarcodeIMEINo.create({
            createdId: userId,
            batchNo,
            lotNo,
            imeiNo
        });

        return res.status(200).json({
            success: true,
            message: "addBarCode SuccessFully",
        })


    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error in addBarCode"
        })
    }
}


exports.fetchAllBarCodeIMEINo = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                success: false,
                message: 'Please Provide UserId'
            })
        }
        // fetch all BarCode IMEI No
        const allBarCodeIMEINo = await AddBarcodeIMEINo.find({});
        if (allBarCodeIMEINo.length === 0) {

            return res.status(200).json({
                success: false,
                message: 'No Data Found'
            })
        }
        return res.status(200).json({
            success: true,
            message: "Fetched SuccessFully",
            allBarCodeIMEINo
        })


    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error in fetchAllBarCodeIMEINo"
        })
    }
}

// verify another user
exports.veriFyImeiNoAgain = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                success: false,
                message: 'Please Provide UserId'
            })
        }

        const { imeiNo } = req.body;
        if (!imeiNo) {
            return res.status(200).json({
                success: false,
                message: 'Please Provide imeiNo'
            })

        }

        // verify imeiNo
        const imeiNoExists = await AddBarcodeIMEINo.findOne({ imeiNo });
        if (!imeiNoExists) {
            return res.status(200).json({
                success: false,
                message: "IMEI No not found"
            });
        }

        // i want to update status_ONE to true when verified
        imeiNoExists.status_ONE = true;
        await imeiNoExists.save();

        return res.status(200).json({
            success: true,
            message: "IMEI No verified successfully",
        })


    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error in veriFyImeiNoAgain"
        })
    }
}


// add Soldering controller logic
exports.addSolderingDetails = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                success: false,
                message: 'Please Provide UserId'
            })
        }

        const { barcodeImeiId, plus12v, gnd2, ignition, din1, din2, scs, led, sos4v, an1, an2, din3, op2, gnd13, op1, tx, rx, gnd17 } = req.body;

        if (!barcodeImeiId || !plus12v || !gnd2 || !ignition || !din1 || !din2 || !scs || !led || !sos4v || !an1 || !an2 || !din3 || !op2 || !gnd13 || !op1 || !tx || !rx || !gnd17) {
            return res.status(200).json({
                success: false,
                message: 'Please Provide All Fields'
            })
        }
        // create Soldering details
        const solderingDetails = await SolderingModel.create({
            createdId: userId,
            barcodeImeiId,
            plus12v,
            gnd2,
            ignition,
            din1,
            din2,
            scs,
            led,
            sos4v,
            an1,
            an2,
            din3,
            op2,
            gnd13,
            op1,
            tx,
            rx,
            gnd17,
        })

        // also update in AddBarcodeIMEINoModel solderingStatus to true
        const imeiEntry = await AddBarcodeIMEINo.findById(barcodeImeiId);
        if (imeiEntry) {
            imeiEntry.solderingStatus = true;
            await imeiEntry.save();
        }


        return res.status(200).json({
            success: true,
            message: 'Soldering Details Added SuccessFully',
            solderingDetails
        })


    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error in addSolderingDetails"
        })
    }
};


exports.fetchSolderingDetailsandImeiNo = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                success: false,
                message: 'Please Provide UserId'
            })
        }

        // fetch all Soldering details with imeiNo
        const solderingDetailsList = await SolderingModel.find({})
            .populate("barcodeImeiId", "imeiNo batchNo lotNo");
        if (solderingDetailsList.length === 0) {
            return res.status(200).json({
                success: false,
                message: 'No Data Found'
            })
        }
        return res.status(200).json({
            success: true,
            message: "Fetched SuccessFully",
            solderingDetailsList
        })

    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error in fetchSolderingDetailsandImeiNo"
        })
    }
}


exports.verifySolderingDetails = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                success: false,
                message: 'Please Provide UserId'
            });
        }

        const { imeiNo } = req.body;
        if (!imeiNo) {
            return res.status(200).json({
                success: false,
                message: 'Please Provide imeiNo'
            });
        }

        const imeiEntry = await AddBarcodeIMEINo.findOne({ imeiNo });

        if (!imeiEntry) {
            return res.status(200).json({
                success: false,
                message: "IMEI No not found"
            });
        }

        const solderingDetails = await SolderingModel.findOne({ barcodeImeiId: imeiEntry._id });

        if (!solderingDetails) {
            return res.status(200).json({
                success: false,
                message: "Soldering details not found for this IMEI No"
            });
        }

        const detailsObject = solderingDetails.toObject();

        // EXCLUDED FIELDS CORRECTED ✔️
        const excludedFields = [
            "_id",
            "barcodeImeiId",
            "createdAt",
            "updatedAt",
            "__v",
            "status_Soldering",
            "batteryConnectionStatus",
            "createdId"
        ];

        const notTrueFields = Object.entries(detailsObject)
            .filter(([key]) => !excludedFields.includes(key))
            .filter(([key, value]) => !(value === true || value === "true"))
            .map(([key, value]) => ({ field: key, value }));

        if (notTrueFields.length > 0) {
            return res.status(200).json({
                success: false,
                message: "Soldering verification failed: Some fields are not true",
                failedFields: notTrueFields
            });
        }

        // ⭐ All good → mark status true
        solderingDetails.status_Soldering = true;
        await solderingDetails.save();

        return res.status(200).json({
            success: true,
            message: "Soldering verification successful: All fields are true"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Server Error in verifySolderingDetails"
        });
    }
};



exports.addBatteryConnectionDetails = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                success: false,
                message: 'Please Provide UserId'
            })
        }

        const { imeiNo, batteryType, voltage, batteryConnectedStatus, capacitorConnectedStatus } = req.body;
        if (!imeiNo || !batteryType || !voltage) {
            return res.status(200).json({
                success: false,
                message: 'Please Provide imeiNo, batteryType, voltage batteryConnectedStatus capacitorConnectedStatus'
            })
        }


        //prevent duplicate entry
        const existingEntry = await BatteryConnectionModel.findOne({ imeiNo });
        if (existingEntry) {
            return res.status(200).json({
                success: false,
                message: "Battery connection details for this IMEI No are already added"
            });
        }

        // create BatteryConnection details
        const batteryConnectionDetails = await BatteryConnectionModel.create({
            createdId: userId,
            imeiNo,
            batteryType,
            voltage,
            batteryConnectedStatus,
            capacitorConnectedStatus
        })



        // Here some work will be done now
        // first call api in addBarCodeImeiNoModel
        const imei = await AddBarcodeIMEINo.findOne({ imeiNo });

        if (!imei) {
            return res.status(200).json({
                success: false,
                message: "IMEI No not found in AddBarcodeIMEINoModel"
            });
        }

        // Then db call for in soldering Model
        const solderingEntry = await SolderingModel.findOne({ barcodeImeiId: imei._id });
        if (!solderingEntry) {
            return res.status(200).json({
                success: false,
                message: "Soldering details not found for this IMEI No"
            });
        }

        // Here we can update status for batteryConnectionStatus in soldering model
        solderingEntry.batteryConnectionStatus = true;
        await solderingEntry.save();

        return res.status(200).json({
            success: true,
            message: 'Battery Connection Details Added SuccessFully',
            batteryConnectionDetails
        })

    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error in addBatteryConnectionDetails"
        })
    }
};


exports.fetchBatteryConnectionDetails = async (req, res) => {
    try {
        const userId = req.user.userId;
        if (!userId) {
            return res.status(200).json({
                success: false,
                message: 'Please Provide UserId'
            })
        }

        // fetch all Battery Connection details
        const batteryConnectionDetailsList = await BatteryConnectionModel.find({});
        if (batteryConnectionDetailsList.length === 0) {
            return res.status(200).json({
                success: false,
                message: 'No Data Found'
            })
        }

        return res.status(200).json({
            success: true,
            message: "Fetched SuccessFully",
            batteryConnectionDetailsList
        })


    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error in fetchBatteryConnectionDetails"
        })
    }
}


exports.createFirmWare = async (req, res) => {
    try {
        const userId = req.user.userId;
        if (!userId) {
            return res.status(200).json({
                success: false,
                message: 'Please Provide UserId'
            })
        }


        const { imeiNo, iccidNo, slNo } = req.body;
        if (!imeiNo || !iccidNo || !slNo) {
            return res.status(200).json({
                success: false,
                message: 'Please Provide imeiNo, iccidNo, slNo'
            })
        }

        // create FirmWare details
        const firmWareDetails = await FirmWareModel.create({
            createdId: userId,
            imeiNo,
            iccidNo,
            slNo
        })

        // also find in BatteryConnectionModel and update overAllassemblyStatus to true
        const batteryEntry = await BatteryConnectionModel.findOne({ imeiNo });
        if (batteryEntry) {
            batteryEntry.overAllassemblyStatus = true;
            await batteryEntry.save();
        }


        return res.status(200).json({
            success: true,
            message: 'FirmWare Details Added SuccessFully',
            firmWareDetails
        })


    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error in createFirmWare"
        })
    }
}


// fetch firmware By Id
exports.fetchFirmwareByImeiNo = async (req, res) =>{
    try {
        const userId = req.user.userId;
        if (!userId) {
            return res.status(200).json({
                success: false,
                message: 'Please Provide UserId'
            })
        }

        const { imeiNo } = req.body;

        if (!imeiNo) {
            return res.status(200).json({
                success: false,
                message: 'Please Provide imeiNo'
            })
        }
        // find FirmWare details by imeiNo
        const firmWareDetails = await FirmWareModel.findOne({ imeiNo });
        if (!firmWareDetails) {
            return res.status(200).json({
                success: false,
                message: 'FirmWare Details not found'
            })
        }

        return res.status(200).json({
            success: true,
            message: 'FirmWare Details Fetched SuccessFully',
            firmWareDetails
        })

    } catch (error) {
        console.log(error,error.message);
        return res.status(500).json({
            success:false,
            message:"Server Error in fetchFirmwareById"
        })
    }
}

// edit Firmware Details
exports.editFirmWareDetails = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                success: false,
                message: 'Please Provide UserId'
            })
        }
        const { firmWareId, imeiNo, iccidNo, slNo } = req.body;

       
        if (!firmWareId) {
            return res.status(200).json({
                success: false,
                message: 'Please Provide firmWareId'
            })
        }
        // find and update FirmWare details
        const firmWareDetails = await FirmWareModel.findById(firmWareId);
        if (!firmWareDetails) {
            return res.status(200).json({
                success: false,
                message: 'FirmWare Details not found'
            })
        }
        firmWareDetails.imeiNo = imeiNo || firmWareDetails.imeiNo;
        firmWareDetails.iccidNo = iccidNo || firmWareDetails.iccidNo;
        firmWareDetails.slNo = slNo || firmWareDetails.slNo;
        await firmWareDetails.save();
        return res.status(200).json({
            success: true,
            message: 'FirmWare Details Updated SuccessFully',
            firmWareDetails
        })

    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error in editFirmWareDetails"
        })
    }
}

// delete FirmWare Details 
exports.deleteFirmWareDetails = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(200).json({
                success: false,
                message: 'Please Provide UserId'
            })
        }

        const { imeiNo } = req.body;
        if (!imeiNo) {
            return res.status(200).json({
                success: false,
                message: 'Please Provide imeiNo'
            })
        }
        // find and delete FirmWare details
        const firmWareDetails = await FirmWareModel.findOneAndDelete({ imeiNo });
        if (!firmWareDetails) {
            return res.status(200).json({
                success: false,
                message: 'FirmWare Details not found'
            })
        }


        // also delete in batteryConnectionModel 
        const batteryEntry = await BatteryConnectionModel.findOneAndDelete({ imeiNo: firmWareDetails.imeiNo });
        if(!batteryEntry){
            return res.status(200).json({
                success: false,
                message: 'Battery Connection Details not found to delete'
            })
        }

        // also delete in solderingModel
        const imeiEntry = await AddBarcodeIMEINo.findOne({ imeiNo: firmWareDetails.imeiNo });
        if (imeiEntry) {
            const solderingEntry = await SolderingModel.findOneAndDelete({ barcodeImeiId: imeiEntry._id });
            if (!solderingEntry) {
                return res.status(200).json({
                    success: false,
                    message: 'Soldering Details not found to delete'
                })
            }
        }

        // also delete in AddBarcodeIMEINoModel
        const imeiDeleted = await AddBarcodeIMEINo.findOneAndDelete({ imeiNo: firmWareDetails.imeiNo });
        if (!imeiDeleted) {
            return res.status(200).json({
                success: false,
                message: 'IMEI Details not found to delete'
            })
        }

        return res.status(200).json({
            success: true,
            message: 'FirmWare Details Deleted SuccessFully',
            firmWareDetails
        })

    } catch (error) {
        console.log(error, error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error in deleteFirmWareDetails"
        })
    }
}



exports.fetchFirmWareDetails = async (req, res) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized: UserId missing'
            });
        }

        const firmWareDetailsList = await FirmWareModel.find({});

        if (!firmWareDetailsList || firmWareDetailsList.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No Data Found'
            });
        }

        // ✅ Attach IMEI Details manually
        const finalData = await Promise.all(
            firmWareDetailsList.map(async (fw) => {
                const imeiData = await AddBarcodeIMEINo.findOne({
                    imeiNo: fw.imeiNo
                });

                return {
                    ...fw.toObject(),
                    imeiDetails: imeiData || null
                };
            })
        );

        return res.status(200).json({
            success: true,
            message: "Fetched Successfully",
            firmWareDetailsList: finalData
        });

    } catch (error) {
        console.error("fetchFirmWareDetails Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error in fetchFirmWareDetails"
        });
    }
};


exports.QualityCheck = async (req, res) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Please Provide UserId'
            });
        }

        const { empName,
            imeiNo,
            probePin,
            powerSupply,
            capacitorBackup,
            terminal,
            signalIntegraty,
            cabelStrain,
            ledCheck,
            gpsClod,
            gsmNetwork,
            productId,
            physicallyAssembly,
            housingSeal,
            labelPlaceMent,
            qrCodeRelaliablty,
            finalVisualInspection,
            packingMatarialIntegraty
        } = req.body;

        if (!imeiNo) {
            return res.status(400).json({
                success: false,
                message: "Please Provide imeiNo"
            });
        }

        // ✅ Find existing quality record using imeiNo
        let qualityData = await OcModel.findOne({ imeiNo });

        if (!qualityData) {
            // ✅ CREATE NEW ENTRY IF NOT EXISTS
            qualityData = await OcModel.create({
                createdId: userId,
                empName,
                imeiNo,
                probePin,
                powerSupply,
                capacitorBackup,
                terminal,
                signalIntegraty,
                cabelStrain,
                ledCheck,
                gpsClod,
                gsmNetwork,
                productId,
                physicallyAssembly,
                housingSeal,
                labelPlaceMent,
                qrCodeRelaliablty,
                finalVisualInspection,
                packingMatarialIntegraty
            });


            // find in FirmWareModel and update qualityCheckStatus to true
            const firmwareEntry = await FirmWareModel.findOne({ imeiNo });

            if (firmwareEntry) {
                firmwareEntry.firmWareStatus = true;
                await firmwareEntry.save();
            }

            return res.status(201).json({
                success: true,
                message: "Quality Check Data Created Successfully",
                data: qualityData
            });

        }



    } catch (error) {
        console.log("QualityCheck Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error in QualityCheck"
        });
    }
};


exports.FetchallQualityCheck = async (req, res) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Please Provide UserId'
            });
        }

        // ✅ Fetch all QC data
        const allQualityCheckData = await OcModel.find({});

        if (!allQualityCheckData || allQualityCheckData.length === 0) {
            return res.status(200).json({
                success: false,
                message: 'No Data Found'
            });
        }

        // ✅ Also attach FirmWareModel details using imeiNo
        const finalData = await Promise.all(
            allQualityCheckData.map(async (qc) => {
                const firmwareData = await FirmWareModel.findOne({
                    imeiNo: qc.imeiNo
                });

                return {
                    ...qc.toObject(),
                    firmwareDetails: firmwareData || null
                };
            })
        );

        return res.status(200).json({
            success: true,
            message: "Fetched Successfully",
            allQualityCheckData: finalData   // ✅ FIXED HERE
        });

    } catch (error) {
        console.log("FetchallQualityCheck Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error in FetchallQualityCheck"
        });
    }
};



exports.getTodayFirmwareReport = async (req, res) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Please Provide UserId",
            });
        }

        // 📅 TODAY DATE
        const today = new Date();

        // ⏰ 10 AM IST → 04:30 UTC
        const startTime = new Date(today);
        startTime.setUTCHours(4, 30, 0, 0);

        // ⏰ 6 PM IST → 12:30 UTC
        const endTime = new Date(today);
        endTime.setUTCHours(12, 30, 0, 0);

        const report = await FirmWareModel.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: startTime,
                        $lte: endTime,
                    },
                },
            },
            {
                $group: {
                    _id: {
                        day: {
                            $dateToString: {
                                format: "%Y-%m-%d",
                                date: "$createdAt",
                                timezone: "Asia/Kolkata",
                            },
                        },
                    },

                    totalFirmware: { $sum: 1 },

                    completed: {
                        $sum: {
                            $cond: [{ $eq: ["$firmWareStatus", true] }, 1, 0],
                        },
                    },

                    pending: {
                        $sum: {
                            $cond: [{ $eq: ["$firmWareStatus", false] }, 1, 0],
                        },
                    },

                    imeis: {
                        $push: {
                            imeiNo: "$imeiNo",
                            iccidNo: "$iccidNo",
                            slNo: "$slNo",
                            firmWareStatus: "$firmWareStatus",
                            createdAt: "$createdAt",
                        },
                    },
                },
            },
        ]);

        if (report.length === 0) {
            return res.status(200).json({
                success: false,
                message: "No Firmware Work Found Today (10 AM – 6 PM IST)",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Today Firmware Report Fetched Successfully",
            data: report,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server Error in getTodayFirmwareReport",
        });
    }
};




exports.showAllDateReports = async (req, res) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Please Provide UserId",
            });
        }

        let { date } = req.body;

        if (!date) {
            return res.status(400).json({
                success: false,
                message: "Please Provide date",
            });
        }

        let normalizedDate;

        if (/^\d{4}-\d{2}-\d{2}$/.test(date)) normalizedDate = date;
        else if (/^\d{2}-\d{2}-\d{4}$/.test(date)) {
            const [d, m, y] = date.split("-");
            normalizedDate = `${y}-${m}-${d}`;
        }
        else if (/^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
            const [d, m, y] = date.split("/");
            normalizedDate = `${y}-${m}-${d}`;
        }
        else {
            return res.status(400).json({
                success: false,
                message: "Invalid date format",
            });
        }

        const startDateIST = new Date(`${normalizedDate}T00:00:00+05:30`);
        const endDateIST = new Date(`${normalizedDate}T23:59:59+05:30`);

        const startUTC = new Date(startDateIST.toISOString());
        const endUTC = new Date(endDateIST.toISOString());

        const reports = await OcModel.find({
            createdAt: { $gte: startUTC, $lt: endUTC }
        });

        if (reports.length === 0) {
            return res.status(200).json({
                success: false,
                message: "No Data Found for this date",
            });
        }

        // =============================
        // ADD slNo & iccid
        // =============================
        const enrichedReports = [];

        for (let report of reports) {
            const firmwareData = await FirmWareModel.findOne(
                { imeiNo: report.imeiNo },
                { slNo: 1, iccidNo: 1, _id: 0 } // return only slNo & iccid
            );

            enrichedReports.push({
                ...report.toObject(),
                firmwareDetails: firmwareData ? {
                    slNo: firmwareData.slNo || null,
                    iccidNo: firmwareData.iccidNo || null
                } : null
            });
        }

        return res.status(200).json({
            success: true,
            message: "Fetched Successfully",
            normalizedDate,
            count: enrichedReports.length,
            reports: enrichedReports
        });

    } catch (error) {
        console.log("❌ Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Server Error in showAllDateReports",
        });
    }
};


exports.fetchQCReport = async (req, res) => {
    try {

        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Please Provide UserId",
            });
        }

        const { date } = req.body;

        if (!date) {
            return res.status(400).json({
                success: false,
                message: "Please Provide date"
            });
        }

        let start, end;

        // Detect Format
        if (date.includes('-')) {
            const parts = date.split('-');

            if (parts[0].length === 4) {
                // YYYY-MM-DD → already correct format
                start = new Date(date);
                end = new Date(date);
            } else {
                // DD-MM-YYYY → convert to YYYY-MM-DD
                const [dd, mm, yyyy] = parts;
                start = new Date(`${yyyy}-${mm}-${dd}`);
                end = new Date(`${yyyy}-${mm}-${dd}`);
            }
        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid date format"
            });
        }

        // full day range
        end.setHours(23, 59, 59, 999);

        const qcReport = await OcModel.find({
            createdAt: {
                $gte: start,
                $lte: end,
            }
        });

        if (qcReport.length === 0) {
            return res.status(200).json({
                success: false,
                message: "No Data Found for this date"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Fetched Successfully",
            count: qcReport.length,
            qcReport
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Server Error in fetchQCReport"
        });
    }
};












exports.getTodayReport = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Please Provide UserId"
            });
        }

        // ================= IST TIME RANGE (PRODUCTION SAFE) =================
        const now = new Date();

        // IST = UTC + 5:30
        const istOffset = 5.5 * 60 * 60 * 1000;
        const istNow = new Date(now.getTime() + istOffset);

        // 9:30 AM IST
        const startIST = new Date(istNow);
        startIST.setHours(9, 30, 0, 0);

        // 5:45 PM IST
        const endIST = new Date(istNow);
        endIST.setHours(17, 45, 0, 0);

        // Convert IST → UTC for MongoDB
        const startUTC = new Date(startIST.getTime() - istOffset);
        const endUTC = new Date(endIST.getTime() - istOffset);

        // ================= FETCH DATA =================
        const barcodes = await AddBarcodeIMEINo
            .find({ createdAt: { $gte: startUTC, $lte: endUTC } })
            .populate("createdId");

        const solderings = await SolderingModel.find().populate("createdId");
        const batteries = await BatteryConnectionModel.find().populate("createdId");
        const firmwares = await FirmWareModel.find().populate("createdId");
        const qcs = await OcModel.find();

        // ================= BUILD REPORT PER IMEI =================
        const report = barcodes.map(barcode => {
            const imei = barcode.imeiNo;

            const soldering = solderings.find(
                s => String(s.barcodeImeiId) === String(barcode._id)
            );

            const battery = batteries.find(b => b.imeiNo === imei);
            const firmware = firmwares.find(f => f.imeiNo === imei);
            const qc = qcs.find(q => q.imeiNo === imei);

            return {
                imeiNo: imei,

                workFlow: {
                    barcode: barcode.createdId?.userName || "Pending",
                    soldering: soldering?.createdId?.userName || "Pending",
                    batteryAndCapacitor: battery?.createdId?.userName || "Pending",
                    firmware: firmware?.createdId?.userName || "Pending",
                    qc: qc?.empName || "Pending"
                },

                qcStatus: qc?.finalVisualInspection ? "Completed" : "Pending",

                lastUpdatedAt: new Date(
                    Math.max(
                        barcode.updatedAt || 0,
                        soldering?.updatedAt || 0,
                        battery?.updatedAt || 0,
                        firmware?.updatedAt || 0,
                        qc?.updatedAt || 0
                    )
                )
            };
        });

        return res.status(200).json({
            success: true,
            message: "Today IMEI Workflow Report Fetched Successfully",
            totalImeis: report.length,
            data: report
        });

    } catch (error) {
        console.error("❌ getTodayReport Error:", error);
        return res.status(500).json({
            success: false,
            message: "Server Error in getTodayReport"
        });
    }
};



