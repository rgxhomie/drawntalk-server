const socketIO = require('socket.io');

let canvasStates = {};

function initializeWebSocket(server) {
  const io = socketIO(
    server,
    {
        cors: {
            origin: 'https://drawntalk.site',
            methods: ['GET', 'POST'],
            allowedHeaders: ['auth-token', 'Origin', 'X-Requested-With', 'Content-Type', 'Accept']
        }
    }
  );

  io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('joinRoom', (roomId) => {
        socket.join(roomId);
        canvasStates[roomId] = canvasStates[roomId] ? canvasStates[roomId] : [];
        socket.emit('currentCanvasState', canvasStates[roomId]);
        console.log(`User joined to ${roomId}`);
    });

    socket.on('draw', ({to, ...data}) => {
        socket.to(to).emit('draw', data);
        try {
          canvasStates[to].push(data);
        } catch (error) {
          canvasStates[to] = [];
        }
    });

    socket.on('clearCanvas', (to) => {
      socket.to(to).emit('clearCanvas');
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
}

module.exports = { initializeWebSocket };
