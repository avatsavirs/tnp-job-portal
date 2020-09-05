const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');

/* Schema */
const StudentSchema = new mongoose.Schema(
  {
    rollNumber: {
      type: Number,
      unique: true,
      min: 1000000, // roll numbers...
      max: 9999999 // ...must be exactly 7 digits
    },
    name: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

StudentSchema.plugin(uniqueValidator);

StudentSchema.pre('save', function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  bcrypt.hash(this.password, 10, (err, hash) => {
    if (err) {
      return next(err);
    }
    this.password = hash;
    next();
  });
});

StudentSchema.methods.checkPassword = function (EnteredPassword) {
  const passwordHash = this.password;
  return new Promise(function (resolve, reject) {
    bcrypt.compare(EnteredPassword, passwordHash, function (error, isMatch) {
      if (error) return reject(error);
      resolve(isMatch);
    });
  });
};

module.exports = mongoose.model('student', StudentSchema);
