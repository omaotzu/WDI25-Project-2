const User = require('../models/user');
const Promise = require('bluebird');
const s3 = Promise.promisifyAll(require('../lib/s3'));

function showRoute(req, res, next) {
  User
    .findById(req.params.id)
    .populate('createdBy pics.createdBy')
    .exec()
    .then((thisUser) => {
      if(!thisUser) return res.notFound();
      return res.render('users/show', { thisUser });
    })
    .catch(next);
}

function editRoute(req, res, next) {
  // req.body.createdBy = req.user;
  User
    .findById(req.params.id)
    .exec()
    .then((user) => {
      if(!user) {
        req.flash('alert', 'You must own this profile');
        return res.redirect(`/users/${user.id}`);
      } else {
        res.render('users/edit', { user });
      }
    })
    .catch(next);
}

function updateRoute(req, res, next) {
  if (req.file) req.body.image = req.file.key;
  User
    .findById(req.params.id)
    .then((user) => {
      if(user.image && req.file) {
        s3.removeObjectAsync({Key: user.image}).then(() => {
          return user;
        });
      }else {
        return user;
      }
    })
    .then((user) => {
      if(!user) return res.notFound();
      for(const field in req.body) {
        user[field] = req.body[field];
      }
      return user.save();
    })
    .then((user) => res.redirect(`/users/${user.id}`))
    .catch((err) => {
      if(err.name === 'ValidationError') return res.badRequest(`/users/${req.params.id}/edit`, err.toString());
      next(err);
    });
}


function createImageRoute(req, res, next) {
  if(req.file) req.body.filename = req.file.key;
  req.body = Object.assign({}, req.body);
  req.user.pics.push(req.body);
  req.user
    .save()
    .then((user) => res.redirect(`/users/${user.id}`))
    .catch((err) => {
      console.log(err);
      if(err.name === 'ValidationError') return res.badRequest(`/users/${req.user.id}`, err.toString());
      next(err);
    });
}


function deleteImageRoute(req, res, next) {
  if(req.file) req.body.filename = req.file.key;
  User
    .findById(req.params.id)
    .exec()
    .then((user) => {
      if(!user) return res.notFound();
      const image = user.pics.id(req.params.imageId);
      image.remove();
      return user.save();
    })
    .then(() => res.redirect(`/users/${req.params.id}`))
    .catch(next);
}


module.exports = {
  show: showRoute,
  edit: editRoute,
  update: updateRoute,
  createImage: createImageRoute,
  deleteImage: deleteImageRoute
};
