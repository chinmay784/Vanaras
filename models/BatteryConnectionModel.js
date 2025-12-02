const mongoose = require('mongoose');

const BatteryConnectionModel = new mongoose.Schema({
    imeiNo: { type: String, trim: true },
    batteryType: { type: String, trim: true },
    voltage: { type: String, trim: true },
    batteryConnectedStatus: {
        type: Boolean,
        default: false,
    },
    capacitorConnectedStatus: {
        type: Boolean,
        default: false,
    },
    overAllassemblyStatus: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
module.exports = mongoose.model("BatteryConnectionModel", BatteryConnectionModel);

