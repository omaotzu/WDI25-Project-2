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
  req.body.createdBy = req.user;
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
    .populate('createdBy comments.createdBy')
    .exec()
    .then((place) => {
      if(!place) return res.notFound();
      return res.render('places/show', { place });
    })
    .catch(next);
}

function editRoute(req, res, next) {
  // req.body.createdBy = req.user;
  Place
    .findById(req.params.id)
    .exec()
    .then((place) => {
      if (req.user.id === place.createdBy.toString()) {
        return res.render('places/edit', { place });
      } else {
        req.flash('alert', 'You must own this place');
        return res.redirect(`/places/${place.id}`);
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


module.exports = {
  index: indexRoute,
  new: newRoute,
  create: createRoute,
  show: showRoute,
  edit: editRoute,
  update: updateRoute,
  delete: deleteRoute,
  createComment: createCommentRoute,
  deleteComment: deleteCommentRoute
};
