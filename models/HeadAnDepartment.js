const mongoose = require("mongoose");
const { type } = require("os");

const HeadAnDepartmentSchema = new mongoose.Schema({
    departmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Depertment",
    },
    DepartmentHeadName: { type: String, trim: true },
    DepartmentName:{ type: String, trim: true },
    email: { type: String, trim: true },
    mobile: { type: String, trim: true },
});

module.exports = mongoose.model("HeadAnDepartment", HeadAnDepartmentSchema)