module.exports = function(app, router) {
	var bodyParser = require('body-parser');
	app.use(bodyParser.urlencoded({ extended: true }));

	var authController = require('./controller/auth_controller');

	app.get('/', function(req, res) {
		res.redirect('/api');
	});

	router.get('/', function(req, res) {
		res.json({ message: 'Invalid URL.' });
	});

	var userController = require('./controller/user_controller');
	router.route('/users')
		.get(authController.isAuthenticated, userController.list)
		.post(userController.create);

	router.route('/users/:id')
		.get(authController.isAuthenticated, userController.read)
		.put(authController.isAuthenticated, userController.update)
		.delete(authController.isAuthenticated, userController.delete);

	router.route('/me')
		.get(authController.isAuthenticated, userController.me);

	var bmController = require('./controller/bookmark_controller');
	router.route('/bookmarks')
		.get(authController.isAuthenticated, bmController.list)
		.post(authController.isAuthenticated, bmController.create);

	router.route('/bookmarks/:id')
		.get(authController.isAuthenticated, bmController.read)
		.put(authController.isAuthenticated, bmController.update)
		.delete(authController.isAuthenticated, bmController.delete);

	app.use('/api', router);	
};

