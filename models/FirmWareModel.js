const mongoose = require("mongoose");

const FirmWareSchema = new mongoose.Schema({
    createdId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    imeiNo: { type: String, required: true, unique: true },
    iccidNo: { type: String, required: true, unique: true },
    slNo: { type: String, required: true, unique: true },
    firmWareStatus: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });

module.exports = mongoose.model("FirmWare", FirmWareSchema);