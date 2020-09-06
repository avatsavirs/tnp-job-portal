const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');
const {
  isInteger,
  isNotEmpty,
  containsNumber,
  containsSpecialChar,
  containsUpperCaseAndLowerCase
} = require('../../util/validation');
/* Schema */
const StudentSchema = new mongoose.Schema(
  {
    rollNumber: {
      type: Number,
      required: [true, `loginId is required`],
      unique: true,
      min: [1000000, `invalid roll number`], // roll numbers...
      max: [9999999, `invalid roll number`], // ...must be exactly 7 digits
      validate: [isInteger, `invalid roll number`]
    },
    name: {
      type: String,
      trim: true,
      required: [true, `name is required`],
      maxlength: [100, `name too long`],
      validate: [isNotEmpty, `name cannot be empty`]
    },
    password: {
      type: String,
      required: [true, `password is required`],
      minlength: [8, `password should be atleast 8 characters`],
      validate: [
        {
          validator: containsNumber,
          message: `password must contain at least one number`
        },
        {
          validator: containsSpecialChar,
          message: `password must contain at least one special character`
        },
        {
          validator: containsUpperCaseAndLowerCase,
          message: `password must contain at least one uppercase and one lowercase character`
        }
      ]
    }
  },
  { timestamps: true }
);

StudentSchema.plugin(uniqueValidator, { message: '{PATH} must be unique' });

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
