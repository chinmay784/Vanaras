const mongoose = require("mongoose");


const AssignWorkSchema = new mongoose.Schema(
    {
        workTitel: { type: String, trim: true },
        workDescription: {
            type: String, trim: true
        },
        workAssignToId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee",
        },
        whoAssignWorkId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "HeadAnDepartment",
        },
        status: {
            type: Boolean,
            default: false,
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("AssignWork", AssignWorkSchema);