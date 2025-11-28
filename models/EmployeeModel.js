const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
    departmentHeadId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "HeadAnDepartment"
    },
    empName: { type: String, trim: true },
    empEmail: { type: String, trim: true },
    empMobile: { type: String, trim: true },
    assignWork: [
        {
            type: String, trim: true
        }
    ]
});

module.exports = mongoose.model("Employee",EmployeeSchema)