const router = require('express').Router();
const registrations = require('../controllers/registrations');
const sessions = require('../controllers/sessions');
const users = require('../controllers/users');
const places = require('../controllers/places');
const upload = require('../lib/upload');
const secureRoute = require('../lib/secureRoute');

router.get('/', (req, res) => res.render('statics/index'));


router.route('/places')
  .get(places.index)
  .post(upload.single('image'), places.create);

router.route('/places/new')
  .get(secureRoute, places.new);

router.route('/places/:id')
  .get(places.show)
  .put(secureRoute, places.update)
  .delete(secureRoute, places.delete);

router.route('/places/:id/edit')
  .get(secureRoute, places.edit);

router.route('/places/:id/images')
  .post(secureRoute, upload.single('picture'), places.createImage);

router.route('/places/:id/images/:imageId')
  .delete(secureRoute, places.deleteImage);

// router.route('/places/:id/images/:imageId/comments')
//   .post(secureRoute, places.createImageComment);

router.route('/places/:id/comments')
  .post(secureRoute, places.createComment);

router.route('/places/:id/comments/:commentId')
  .delete(secureRoute, places.deleteComment);

router.route('/users/:id')
  .get(users.show);


router.route('/users/:id/images')
  .post(secureRoute, upload.single('picture'), users.createImage);

router.route('/users/:id/images/:imageId')
  .delete(secureRoute, users.deleteImage);

router.route('/profile')
  .get(secureRoute, registrations.show)
  .delete(secureRoute, registrations.delete);

router.route('/register')
  .get(registrations.new)
  .post(upload.single('image'), registrations.create);

router.route('/login')
  .get(sessions.new)
  .post(sessions.create);

router.route('/logout')
  .get(sessions.delete);


router.all('*', (req, res) => res.notFound());

module.exports = router;
