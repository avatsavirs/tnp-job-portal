const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');
const {
  isURL,
  isAlphabetical,
  isStudentEmail,
  containsNumber,
  containsSpecialChar,
  containsUpperCaseAndLowerCase,
  isPincode,
  isYear
} = require('../../util/validation');

/* Schema */
const addressSchema = new mongoose.Schema({
  addrLine1: {
    type: String,
    trim: true,
    required: "addrLine1 is required"
  },
  addrLine2: {
    type: String,
    trim: true,
    required: "addrLine2 is required"
  },
  city: {
    type: String,
    trim: true,
    required: "city is required",
    validate: [isAlphabetical, `invalid city name`]
  },
  state: {
    type: String,
    trim: true,
    required: "state is required",
    validate: [isAlphabetical, `invalid state name`]
  },
  country: {
    type: String,
    trim: true,
    required: "country is required",
    validate: [isAlphabetical, `invalid country name`]
  },
  pincode: {
    type: String,
    required: "pincode is required",
    validate: [isPincode, `invalid pincode`]
  }
}, {_id: false});

const SchoolDetailSchema = new mongoose.Schema({
  schoolName: {
    type: String,
    required: 'school name is required',
    validate: {
      validator: (name)=>/^([a-z\.]\s?)*\s*$/i.test(name),
      message:  `invalid school name`
    }
  },
  marksType: {
    type: String,
    enum: ['PER', 'CGPA'],
    required: true
  },
  marks: {
    type: Number,
    required: 'marks is required',
    validate: [function (marks) {
      if (this.marksType === "CGPA") return marks <= 10;
      return marks <= 100;
    }, `marks out of range`]
  },
  passingYear: {
    type: Number,
    required: `passingYear is required`,
    validate: [isYear, `year should be in yyyy format`]
  }
}, {_id: false});

const CollegeDetailSchema = new mongoose.Schema({
  branch: {
    type: String,
    trim: true,
    required: 'College branch is required',
    validate: [isAlphabetical, `invalid branch name`]
  },
  cgpa: {
    type: Number,
    required: 'cgpa is required',
    min: 0,
    max: 10
  },
  passingYear: {
    type: Number,
    required: 'passing Year is required',
    validate: [isYear, `year should be in yyyy format`]
  }
}, {_id: false});

const EducationDetailsSchema = new mongoose.Schema({
  classX: {
    type: SchoolDetailSchema,
    required: 'Class X details are required'
  },
  classXII: {
    type: SchoolDetailSchema,
    required: 'Class XII details are required'
  },
  college: {
    type: CollegeDetailSchema,
    required: 'College details are required'
  },
}, {_id: false});

const ProfileSchema = new mongoose.Schema({
  address: {
    type: addressSchema,
    required: 'address is required'
  },
  educationDetails: {
    type: EducationDetailsSchema,
    required: 'educationDetails are required'
  },
  workDetails: [{
    companyName: {
      type: String,
      trim: true,
      required: 'a company name is required',
      validate: {
        validator: (name)=>/^([a-z\.]\s?)*\s*$/i.test(name),
        message:  `invalid company name`
      }
    },
    startedOn: {
      type: Date,
      required:  'a start date is required'
    },
    endedOn: Date,
    workType: {
      type: String,
      enum: ['FT', 'PT', 'IN'],
      required:  'specify the type of employment FullTime(FT), PartTime(PT) or Internship(IN)'
    }
  }],
  projectDetails: [{
    name: {
      type: String,
      trim: true,
      required: 'project must have a name',
      validate: {
        validator: (name)=>/^([a-z\.\-]\s?)*\s*$/i.test(name),
        message:  `invalid project name`
      }
    },
    description: {
      type: String,
      trim: true,
      required: 'project must have a description'
    },
    githubUrl: {
      type: String,
      trim: true,
      required: 'a githubUrl is required for the project',
      validate: [isURL, `Invalid github url`]
    }
  }],
  certifications: [{
    name: {
      type: String,
      trim: true,
      required: 'name of the certifiacte is required',
      validate: [isAlphabetical, `invalid certifiacte name`]
    },
    url: {
      type: String,
      trim: true,
      required: 'a url for certifiacte is required',
      validate: [isURL, `invalid URL`]
    },
    date: {
      type: Date,
      required: 'a date for the certification is required'
    }
  }]
}, {_id: false});

const ApplicationSchema = new mongoose.Schema({
  companyId: mongoose.Schema.Types.ObjectId,
  companyName: {
    type: String,
    trim: true,
    required: true,
    validate: [isAlphabetical, `invalid company name`]
  },
  companyProfileUrl: {
    type: String,
    trim: true,
    required: true,
    validate: [isURL, `Invalid URL`]
  },
  status: {
    type: String,
    trim: true,
    enum: ['ACTIVE', 'INACTIVE'],
    default: 'ACTIVE'
  }
});

const StudentSchema = new mongoose.Schema({
  email: {
    type: String,
    required:  `email is required`,
    unique: true,
    trim: true,
    validate: [isStudentEmail, `invaild email`]
  },
  name: {
    type: String,
    trim: true,
    required:  `name is required`,
    maxlength: [100, `name too long`],
    validate: [isAlphabetical, `name cannot contain any special characters or numbers`]
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

StudentSchema.virtual('rollNumber').get(function () {
  return this.email.split('@')[0];
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
