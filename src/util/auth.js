const { secrets } = require('../config');
const Student = require('../resources/student/student.model');
const jwt = require('jsonwebtoken');

async function studentSignup(req, res) {
  const { name, loginId, password } = req.body;
  if (!name || !loginId || !password) {
    return res.status(401).send({
      message: 'Error: loginId/password/name missing'
    });
  }
  const rollNumber = getRollNumber(loginId);
  let newStudent = new Student({ name, rollNumber, password });
  try {
    newStudent = await newStudent.save();
    const token = createToken(newStudent);
    return res
      .status(201)
      .json({ message: 'Signup successful ', data: { token } });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Signup failed' });
  }
}

async function studentSignin(req, res) {
  const { loginId, password } = req.body;
  if (!loginId || !password) {
    return res.status(401).send({
      message: 'Error: loginId/password missing'
    });
  }

  const rollNumber = getRollNumber(loginId);

  try {
    const student = await Student.findOne({ rollNumber });
    if (!student) {
      return res
        .status(404)
        .send({ message: `Error: Student with loginId ${loginId} not found` });
    }
    const doesPasswordMatch = await student.checkPassword(password);
    if (doesPasswordMatch === false) {
      return res.status(401).json({ message: 'invalid password' });
    }
    const token = createToken(student);
    return res
      .status(200)
      .json({ message: 'Signin Successful', data: { token } });
  } catch (e) {
    console.error(e);
  }
}
async function studentProtect(req, res, next) {
  try {
    const token = req.headers.authorization.split('Bearer ')[1];
    if (!token) {
      throw new Error('Unauthorized Access');
    }
    const payload = await verifyToken(token);
    const student = await Student.findById(payload.id)
      .select('-password')
      .lean()
      .exec();
    if (!student) {
      throw new Error('Unauthorized Access');
    }
    req.student = student;
    next();
  } catch (e) {
    console.error(e);
    return res.status(401).json({
      message: 'Unauthorized Access'
    });
  }
}

module.exports = {
  studentSignup,
  studentSignin,
  studentProtect
};

// **************************************************************
function getRollNumber(loginId) {
  if (typeof loginId == 'number') return loginId;
  return Number(loginId.split('@')[0]);
}

function createToken(user) {
  return jwt.sign({ id: user._id }, secrets.jwt, {
    expiresIn: secrets.jwtExp
  });
}

function verifyToken(token) {
  return new Promise(function (resolve, reject) {
    jwt.verify(token, secrets.jwt, function (error, payload) {
      if (error) return reject(error);
      resolve(payload);
    });
  });
}
