const mongoose = require('mongoose');
const s3 = require('../lib/s3');

const imageSchema = new mongoose.Schema({
  filename: { type: String },
  caption: { type: String },
  createdBy: {type: mongoose.Schema.ObjectId, ref: 'User', required: true}
}, {
  timestamps: true
});
imageSchema.methods.ownedBy = function ownedBy(user) {
  return this.createdBy.id === user.id;
};


const commentSchema = new mongoose.Schema({
  content: {type: String, required: true},
  createdBy: {type: mongoose.Schema.ObjectId, ref: 'User', required: true}
}, {
  timestamps: true
});
commentSchema.methods.writtenBy = function writtendBy(user) {
  return this.createdBy.id === user.id;
};

imageSchema.virtual('picSRC')
  .get(function getImageSRC(){
    if(!this.filename) return null;
    return `https://s3-eu-west-1.amazonaws.com/wdi-london-express-project2/${this.filename}`;
  });


const placeSchema = new mongoose.Schema({
  name: {type: String, required: true},
  region: {type: String, required: true},
  licence: {type: String},
  rating: {type: Number, required: true},
  keywords: {type: String, required: true},
  image: {type: String},
  price: {type: Number},
  address: {type: String, required: true},
  description: {type: String, required: true},
  pictures: [imageSchema],
  comments: [commentSchema]
});

placeSchema
  .virtual('imageSRC')
  .get(function getImageSRC() {
    if(!this.image) return null;
    return `https://s3-eu-west-1.amazonaws.com/wdi-london-express-project2/${this.image}`;
  });

placeSchema.pre('remove', function removeImage(next) {
  s3.deleteObject({Key: this.image}, next);
});



module.exports = mongoose.model('Place', placeSchema);
