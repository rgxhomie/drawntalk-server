const express = require('express');

const router = express.Router();
const Room = require('../models/Room');

// Warm up server
router.get('/warmup', (req, res) => {
    res.send({
        message: 'OK'
    });
});

// Get All Rooms
router.get('/', async (req, res) => {
    try {
        const existingRooms = await Room.find();
        
        const preparedResponse = existingRooms.map((item) => {
            const {__v, canvasDataUrl, ...rest} = item._doc;
            return rest;
        });

        res.json(preparedResponse.filter(room => !room.deleted));
    } catch (error) {
        console.error(`Error occured, while truing to retreive rooms from MongoDB`, error);

        res.status(500);
        res.json({
            error: true,
            message: 'Error while looking up rooms.'
        });
    }
});

// Create Room
// TODO: make names unique
router.post('/create', async (req, res) => {
    // Validate room data:
    if (
        !req.body?.room?.roomName?.length > 5 ||
        !req.body?.room?.roomDescription?.length > 5 ||
        !req.body?.room?.cardColor
    ) {
        res.status(400);
        res.json({
            error: true,
            message: `Invalid room params.`
        });
        return;
    }

    try {
        req.body.room['createdAt'] = new Date().toISOString();
        req.body.room['canvasDataUrl'] = "";

        const newRoom = new Room(req.body.room);
        const savedRoom = await newRoom.save();

        res.json(savedRoom);
    } catch (error) {
        console.error(`Error occured, while creating a room`, error);

        res.status(500);
        res.json({
            error: true,
            message: 'Error while creating a room.'
        });
    }
});

// Delete Room
router.delete('/delete/:id', async (req, res) => {
    try {
        const deletedRoom = await Room.findByIdAndUpdate(
            req.params.id, 
            {
                deleted: true,
                deletedAt: new Date().toISOString()
            }
        );
    
        res.json(deletedRoom);
    } catch (error) {
        console.error(`Error, while deleting a room.`, error);

        res.status(500);
        res.json({
            error: true,
            message: 'Unknown error while looking up room.'
        });
    }
});

// Update Room
router.put('/update/:id', async (req, res) => {
    try {
        const updatedRoom = await Room.findByIdAndUpdate(
            req.params.id, 
            req.body
        );
    
        res.json(updatedRoom);
    } catch (error) {
        console.error(`Error, while deleting a room.`, error);

        res.status(500);
        res.json({
            error: true,
            message: 'Unknown error while looking up room.'
        });
    }
});

// Get Room by ID
router.get('/get/:id', async (req, res) => {
    try {
        const room = await Room.findById({
            _id: req.params.id
        });
    
        res.json(room);
    } catch (error) {
        console.error(error);
        let status;
        let message;

        switch(error.message) {
            case 'Wrong password':
                status = 401;
                message = 'Wrong Password.'
                break;
            default:
                status = 500;
                message = 'Unknown error while looking up room.';
                break;
        }

        res.status(status);
        res.json({
            error: true,
            message: message
        });
    }
});

module.exports = router;