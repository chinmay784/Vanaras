const mongoose = require('mongoose');

const SolderingModel = new mongoose.Schema({
    barcodeImeiId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AddBarcodeIMEINo",
    },
    plus12v: { type: String, trim: true },
    gnd2: { type: String, trim: true },
    ignition: { type: String, trim: true },
    din1: { type: String, trim: true },
    din2: { type: String, trim: true },
    scs: { type: String, trim: true },
    led: { type: String, trim: true },
    sos4v: { type: String, trim: true },
    an1: { type: String, trim: true },
    an2: { type: String, trim: true },
    din3: { type: String, trim: true },
    op2: { type: String, trim: true },
    gnd13: { type: String, trim: true },
    op1: { type: String, trim: true },
    tx: { type: String, trim: true },
    rx: { type: String, trim: true },
    gnd17: { type: String, trim: true },
    status_Soldering: {
        type: Boolean,
        default: false,
    },
    batteryConnectionStatus: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

module.exports = mongoose.model("SolderingModel", SolderingModel);
