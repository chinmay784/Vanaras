const mongoose = require("mongoose");

const DepertmentSchema = new mongoose.Schema({
    DepartmentName: { type: String, trim: true },
    people: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
    }]
});

module.exports = mongoose.model('Depertment', DepertmentSchema);