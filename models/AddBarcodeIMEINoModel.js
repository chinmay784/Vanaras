const mongoose = require("mongoose");

const AddBarcodeIMEINoModel = new mongoose.Schema({
    createdId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    batchNo: {
        type: String,
        trim: true,
    },
    lotNo: {
        type: String,
        trim: true,
    },
    imeiNo: {
        type: String,
        trim: true,
    },
    status_ONE: {
        type: Boolean,
        default: false,
    },
    solderingStatus: {
        type: Boolean,
        default: false,
    }

}, { timestamps: true });
module.exports = mongoose.model("AddBarcodeIMEINo", AddBarcodeIMEINoModel);