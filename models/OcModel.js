const mongoose = require('mongoose');

const OcModelSchema = new mongoose.Schema({
    createdId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    empName: {
        type: String,
        trim: true,
    },
    imeiNo: {
        type: String,
        trim: true,
    },
    ocStatus: {
        type: Boolean,
        default: false,
    },
    probePin: {
        type: Boolean,
        default: false,
    },
    powerSupply: {
        type: Boolean,
        default: false,
    },
    capacitorBackup: {
        type: Boolean,
        default: false,
    },
    terminal: {
        type: Boolean,
        default: false,
    },
    signalIntegraty: {
        type: Boolean,
        default: false,
    },
    cabelStrain: {
        type: Boolean,
        default: false,
    },
    ledCheck: {
        type: Boolean,
        default: false,
    },
    gpsClod: {
        type: Boolean,
        default: false,
    },
    gsmNetwork: {
        type: Boolean,
        default: false,
    },
    productId: {
        type: Boolean,
        default: false,
    },
    physicallyAssembly: {
        type: Boolean,
        default: false,
    },
    housingSeal: {
        type: Boolean,
        default: false,
    },
    labelPlaceMent: {
        type: Boolean,
        default: false,
    },
    qrCodeRelaliablty: {
        type: Boolean,
        default: false,
    },
    finalVisualInspection: {
        type: Boolean,
        default: false,
    },
    packingMatarialIntegraty: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

module.exports = mongoose.model('OcModel', OcModelSchema);