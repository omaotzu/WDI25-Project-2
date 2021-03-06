const router = require('express').Router();
const registrations = require('../controllers/registrations');
const sessions = require('../controllers/sessions');
const users = require('../controllers/users');
const places = require('../controllers/places');
const oauth = require('../controllers/oauth');
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

router.route('/places/:id/tripPLanner')
  .get(places.tripPlanner);

//--------------------Place Images and Comments ------------------------------//

router.route('/places/:id/images')
  .post(secureRoute, upload.single('picture'), places.createImage);

router.route('/places/:id/images/:imageId')
  .delete(secureRoute, places.deleteImage);

router.route('/places/:id/images/:imageId/comments')
  .post(secureRoute, places.createImageComment);

router.route('/places/:id/images/:imageId/comments/:commentId')
  .delete(secureRoute, places.deleteImageComment);

router.route('/places/:id/comments')
  .post(secureRoute, places.createComment);

router.route('/places/:id/comments/:commentId')
  .delete(secureRoute, places.deleteComment);



//-------------------------------Sessions ------------------------------------//

router.route('/users/:id')
  .get(users.show)
  .put(secureRoute, upload.single('image'), users.update);


router.route('/users/:id/edit')
  .get(secureRoute, users.edit);

router.route('/users/:id/images')
  .post(secureRoute, upload.single('picture'), users.createImage);

router.route('/users/:id/images/:imageId')
  .delete(secureRoute, users.deleteImage);

router.route('/oauth/github')
  .get(oauth.github);
//---------------------------Registrations -----------------------------------//
router.route('/profile')
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
