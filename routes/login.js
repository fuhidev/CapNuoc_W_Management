const LocalStrategy = require('passport-local');
var accountManager = require('../modules/AccountDB').create();
var appLogger = require('../modules/Logger').create();
const md5 = require('md5');
module.exports = function (passport) {
	passport.serializeUser((user, done) => {
		done(null, user);
	})
	passport.deserializeUser((username, done) => {
		done(null, username);
	})
	passport.use(new LocalStrategy(
		function (username, password, done) {
			let md5Pwd = md5(password + '_DITAGIS');
			accountManager.isUser(username, md5Pwd)
				.then(function (user) {
					if (!user) {
						return done(null, false, {
							message: 'Incorrect username and password'
						});
					}
					return done(null, user);
					// })
				}).catch(function (err) {
					return done(err);
				})
		}
	))
	var router = require("express").Router();
	router.get('/', function (req, res) {
		if (req.session.passport && req.session.passport.user) {
			res.redirect('/quantri');
			res.end();
		}
		res.render('login', {
			title: 'Đăng nhập'
		});
	});

	router.post('/', function (req, res, next) {
		passport.authenticate('local', function (err, user, info) {
			if (err) {
				return next(err);
			}
			if (!user) {
				return res.render('login', {
					message: 'Tài khoản hoặc mật khẩu không đúng'
				});
			}
			req.logIn(user, function (err) {
				if (err) {
					return next(err);
				}
				if (user.Status === false) {
					res.clearCookie('passport');
					req.session.destroy();
					return res.render('login', {
						message: 'Tài khoản của bạn chưa được kích hoạt hoặc đã khóa, bạn hãy liên lạc với người quản trị của hệ thống để cấp phép cho bạn.'
					});
				}
				appLogger.capabilityLogs([{
					username: req.session.passport.user.Username,
					tacVu: 'Đăng nhập'
				}])
				res.redirect('/quantri');
			});
		})(req, res, next);
	});

	return router;
};