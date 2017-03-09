const Place = require('../models/place');

function indexRoute(req, res, next) {
  Place
    .find()
    .populate('createdBy')
    .exec()
    .then((places) => res.render('places/index', { places }))
    .catch(next);
}

function newRoute(req, res) {
  return res.render('places/new');
}


function createRoute(req, res, next) {
  if(req.file) req.body.image = req.file.key;
  Place
   .create(req.body)
   .then(() => res.redirect('/places'))
   .catch((err) => {
     if(err.name === 'ValidationError') return res.badRequest(`/places/${req.params.id}/edit`, err.toString());
     next(err);
   });
}



function showRoute(req, res, next) {
  Place
    .findById(req.params.id)
    .populate('pictures.createdBy comments.createdBy pictures.icomments.createdBy')
    .exec()
    .then((place) => {
      if(!place) return res.notFound();
      // const imageComments = place.pictures.icomments.id(req.params.icommentId);
      return res.render('places/show', { place/*, imageComments */});
    })
    .catch(next);
}

function editRoute(req, res, next) {
  // req.body.createdBy = req.user;
  Place
    .findById(req.params.id)
    .exec()
    .then((place) => {
      if(!place) {
        req.flash('alert', 'You must own this profile');
        return res.redirect(`/places/${place.id}`);
      } else {
        res.render('places/edit', { place });
      }
    })
    .catch(next);
}

function updateRoute(req, res, next) {
  Place
    .findById(req.params.id)
    .exec()
    .then((place) => {
      if(!place) return res.notFound();

      for(const field in req.body) {
        place[field] = req.body[field];
      }
      return place.save();
    })
    .then(() => res.redirect(`/places/${req.params.id}`))
    .catch((err) => {
      if(err.name === 'ValidationError') return res.badRequest(`/places/${req.params.id}/edit`, err.toString());
      next(err);
    });
}

function createImageRoute(req, res, next) {
  req.body.createdBy = req.user;
  if(req.file) req.body.filename = req.file.key;
  Place
    .findById(req.params.id)
    .populate('createdBy pictures.createdBy')
    .exec()
    .then((place)  => {
      req.body = Object.assign({}, req.body);
      place.pictures.push(req.body);
      return place.save();
    })
    .then(() => res.redirect(`/places/${req.params.id}`))
    .catch((err) => {
      console.log(err);
      if(err.name === 'ValidationError') return res.badRequest(`/places/${req.params.id}`, err.toString());
      next(err);
    });
}

function deleteImageRoute(req, res, next) {
  if(req.file) req.body.filename = req.file.key;
  Place
    .findById(req.params.id)
    .exec()
    .then((place) => {
      if(!place) return res.notFound();
      const image = place.pictures.id(req.params.imageId);
      image.remove();
      return place.save();
    })
    .then(() => res.redirect(`/places/${req.params.id}`))
    .catch(next);
}


function deleteRoute(req, res, next) {
  req.body.createdBy = req.user;
  Place
    .findById(req.params.id)
    .exec()
    .then((place) => {
      if(!place) return res.notFound();
      return place.remove();
    })
    .then(() => res.redirect('/places'))
    .catch(next);
}



function createCommentRoute(req, res, next) {

  req.body.createdBy = req.user;

  Place
    .findById(req.params.id)
    .exec()
    .then((place) => {
      if(!place) return res.notFound();
      place.comments.push(req.body);  ///create an embedded record to push then save the place not the comments
      return place.save();
    })
    .then((place) => res.redirect(`/places/${place.id}`))
    .catch(next);
}


function deleteCommentRoute(req, res, next) {
  Place
    .findById(req.params.id)
    .exec()
    .then((place) => {
      if(!place) return res.notFound();
      //get the embedded record by its id so we can delete it!!!!!
      const comment = place.comments.id(req.params.commentId);
      comment.remove();
      return place.save();
    })
    .then((place) => res.redirect(`/places/${place.id}`))
    .catch(next);
}


function showTripPlanner(req, res, next) {
  Place
    .findById(req.params.id)
    .exec()
    .then((place) => {
      if(!place) return res.notFound();

      return res.render('places/tripPlanner', { place });
    })
    .catch(next);
}


function createImageCommentRoute(req, res, next) {
  req.body.createdBy = req.user;
  Place
    .findById(req.params.id)
    .exec()
    .then((place) => {
      if(!place) return res.notFound();
      const picture = place.pictures.id(req.params.imageId);
      console.log(req.params.imageId);
      picture.icomments.push(req.body);

      return place.save();
    })
    .then((place) => res.redirect(`/places/${place.id}`))
    .catch(next);
}


function deleteImageCommentRoute(req, res, next) {
  Place
    .findById(req.params.id)
    .exec()
    .then((place) => {
      if(!place) return res.notFound();
      const picture = place.pictures.id(req.params.imageId);
      const comment = picture.icomments.id(req.params.commentId);
      comment.remove();
      return place.save();
    })
    .then((place) => res.redirect(`/places/${place.id}`))
    .catch(next);
}

module.exports = {
  index: indexRoute,
  new: newRoute,
  create: createRoute,
  show: showRoute,
  edit: editRoute,
  update: updateRoute,
  delete: deleteRoute,
  createImage: createImageRoute,
  deleteImage: deleteImageRoute,
  createComment: createCommentRoute,
  deleteComment: deleteCommentRoute,
  tripPlanner: showTripPlanner,
  createImageComment: createImageCommentRoute,
  deleteImageComment: deleteImageCommentRoute
};
