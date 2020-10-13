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
const ProfileSchema = new mongoose.Schema({
  address: {
    addrLine1: {
      type: String,
      required:  "addrLine1 is required"
    },
    addrLine2: {
      type: String,
      required:  "addrLine2 is required"
    },
    city: {
      type: String,
      required:  "city is required"
    },
    state: {
      type: String,
      required:  "state is required"
    },
    country: {
      type: String,
      required:  "country is required"
    },
    pincode: {
      type: Number,
      required:  "pincode is required"
    }
  },
  educationDetails: {
    classX: {
      type: {
        schoolName: {
          type: String,
          required: 'classX school name is requires'
        },
        marks: {
          type: Number,
          required: 'classX marks is requires'
        },
        passingYear: {
          type: Number,
          required: 'classX passingYear is required'
        }
      },
      required: 'Class X details are required'
    },
    classXII: {
      type: {
        schoolName: {
          type: String,
          required: 'class XII school name is requires'
        },
        marks: {
          type: Number,
          required: 'class XII marks is requires'
        },
        passingYear: {
          type: Number,
          required: 'class XII passingYear is required'
        }
      },
      required: 'Class XII details are required'
    },
    college: {
      type: {
        branch: {
          type: String,
          required: 'College branch is required'
        },
        cgpa: {
          type: Number,
          required: 'cgpa is required'
        },
        passingYear: {
          type: Number,
          required: 'passing Year is required'
        }
      },
      required: 'college details are required'
    },
  },
  workDetails: [{
    companyName: {
      type: String,
      required:  'a company name is required'
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
      required: 'project must have a name'
    },
    description: {
      type: String,
      required: 'project must have a description'
    },
    githubUrl: {
      type: String,
      required: 'a githubUrl is required for the project'
    }
  }],
  certifications: [{
    name: {
      type: String,
      required: 'name of the certifiacte is required'
    },
    url: {
      type: String,
      required: 'a url for certifiacte is required'
    },
    date: {
      type: Date,
      required: 'a date for the certification is required'
    }
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
