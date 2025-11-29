const mongoose = require("mongoose");

const ProductModel = new mongoose.Schema({
    createdId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    productName: {
        type: String,
        trim: true,
    },
    productType: {
        type: String,
        trim: true,
    },
    modelNo: {
        type: String,
        trim: true,
    },
    partNo: {
        type: String,
        trim: true,
    },
    TacNo: {
        type: String,
        trim: true,
    },
    slNo: {
        type: String,
        trim: true,
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
    iccidNo: {
        type: String,
        trim: true,
    }
});

module.exports = mongoose.model("Product", ProductModel);