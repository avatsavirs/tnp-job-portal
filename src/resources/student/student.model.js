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
const EducationSchema = new mongoose.Schema({
  classX: {
    type: {
      schoolName: String,
      marks: Number,
      passingYear: Number
    },
    required: 'Class'
  },
  classXII: {
    type: {
      schoolName: String,
      marks: Number,
      passingYear: Number
    },
    required: true
  },
  college: {
    type: {
      branch: String,
      cgpa: Number,
      passingYear: Number
    },
    required: true
  },
  certifications: [{
    name: String,
    url: String,
    date: Date
  }]
});

const WorkExperienceSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: [true, 'a company name is required']
  },
  startedOn: {
    type: Date,
    required: [true, 'a start date is required']
  },
  endedOn: Date,
  workType: {
    type: String,
    enum: ['FT', 'PT', 'IN'],
    required: [true, 'specify the type of employment FullTime(FT), PartTime(PT) or Internship(IN)']
  }
});

const AddressSchema = new mongoose.Schema({
  addrLine1: {
    type: String,
    required: [true, "addrLine1 is required"]
  },
  addrLine2: {
    type: String,
    required: [true, "addrLine2 is required"]
  },
  city: {
    type: String,
    required: [true, "city is required"]
  },
  state: {
    type: String,
    required: [true, "state is required"]
  },
  country: {
    type: String,
    required: [true, "country is required"]
  },
  pincode: {
    type: Number,
    required: [true, "pincode is required"]
  }
});

const ProfileSchema = new mongoose.Schema({
  address: AddressSchema,
  educationDetails: EducationSchema,
  workDetails: WorkExperienceSchema,
  projectDetails: [{
    name: String,
    description: String,
    githubUrl: String
  }]
});

const ApplicationSchema = new mongoose.Schema({
  companyId: mongoose.Schema.Types.ObjectId,
  companyName: String,
  companyProfileUrl: String,
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE'],
    default: 'ACTIVE'
  }
});

const StudentSchema = new mongoose.Schema({
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
  },
  profile: ProfileSchema,
  applications: [ApplicationSchema]
},
  { timestamps: true }
);

StudentSchema.virtual('fullAddress').get(function () {
  return this.address.addrLine1 + this.address.addrLine2 + this.address.city + this.address.state + this.address.country + ' (' + this.pincode + ')';
});

StudentSchema.virtual('yearGap').get(function() {
  return (this.educationDetails.college.passingYear - this.educationDetails.classXII.passingYear)-4;
})

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

StudentSchema.methods.checkPassword = function (enteredPassword) {
  const passwordHash = this.password;
  return new Promise(function (resolve, reject) {
    bcrypt.compare(enteredPassword, passwordHash, function (error, isMatch) {
      if (error) return reject(error);
      resolve(isMatch);
    });
  });
};

module.exports = mongoose.model('student', StudentSchema);
