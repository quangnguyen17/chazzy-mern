const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/chazzy_db', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(res => console.log('Successfully connected to database. :)'))
    .catch(err => console.log('Failed to connect to database. Please try again! :('));