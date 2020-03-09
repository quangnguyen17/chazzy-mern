const controllers = require('../controllers/controllers');
const { authenticate } = require('../config/jwt.config');

module.exports = app => {
    // GET (Auth)
    app.get('/api/users', authenticate, controllers.fetch);

    // Login & Regiser
    app.post('/api/users/login', controllers.login);
    app.post('/api/users/register', controllers.register);
    app.get('/api/users/logout', controllers.logout);

    // MESSAGE (Auth)
    app.get('/api/messages', authenticate, controllers.getAllMessages);
    app.get('/api/messages/:senderID', authenticate, controllers.getMessages);
    app.post('/api/messages/send', authenticate, controllers.sendMessage);

    // DELETE
    // app.delete('/api/users', controllers.deleteAll);
}