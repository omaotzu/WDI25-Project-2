const User = require('../models/user');

function showRoute(req, res, next) {
  User
    .findById(req.params.id)
    .populate('createdBy pics.createdBy')
    .exec()
    .then((user) => {
      if(!user) return res.notFound();
      return res.render('users/show', { user });
    })
    .catch(next);
}

function createImageRoute(req, res, next) {
  if(req.file) req.body.filename = req.file.key;
  req.body = Object.assign({}, req.body);
  req.user.pics.push(req.body);
  req.user
    .save()
    .then(() => res.redirect('/profile'))
    .catch((err) => {
      console.log(err);
      if(err.name === 'ValidationError') return res.badRequest(`/users/${req.user.id}`, err.toString());
      next(err);
    });
}





module.exports = {
  show: showRoute,
  createImage: createImageRoute
};
