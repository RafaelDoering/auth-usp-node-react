const Mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ObjectID = Mongoose.Schema.Types.ObjectId;

const UserSchema = Mongoose.Schema(
  {
    _id: ObjectID,
    nusp: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    isUsp: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
    },
    course: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { collection: 'user' },
);

UserSchema.index({ email: 1, isUsp: 1}, {unique: true});

UserSchema.pre(['save', 'updateOne', 'findOneAndUpdate'], function (next) {
  const user = this;

  if (!user.isUsp) {
    try {
      user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
    } catch (err) {
      return next(err);
    }
  }
  next();
});

module.exports = Mongoose.model('user', UserSchema);