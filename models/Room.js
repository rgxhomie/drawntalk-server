const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
    roomName: {
        type: String,
        required: true
    },
    roomDescription: {
        type: String,
        required: true
    },
    cardColor: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        required: true
    },
    canvasDataUrl: {
        type: String,
        required: false
    },
    deleted: {
        type: Boolean,
        required: false
    },
    deletedAt: {
        type: Date,
        required: false
    }
});

module.exports = mongoose.model('room', RoomSchema);