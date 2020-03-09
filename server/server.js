const express = require('express');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express.json(), express.urlencoded({ extended: true }));

require('./config/config');
require('./routes/routes')(app);

const port = 8000;
const server = app.listen(port, () => console.log(`Server is up and listening on port ${port}`));
const io = require('socket.io')(server);

io.on('connection', socket => {
    socket.on('new-message', message => {
        socket.broadcast.emit('received-newMessage', message);
    });
}); 