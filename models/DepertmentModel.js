const mongoose = require("mongoose");

const DepertmentSchema = new mongoose.Schema({
    DepartmentName: { type: String, trim: true },
    people: [{
        type: String, trim: true,
        default: null,
    }]
});

module.exports = mongoose.model('Depertment',DepertmentSchema);