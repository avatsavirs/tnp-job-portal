const Student = require('./student.model');

function getUser(req, res) {
  return res
    .status(200)
    .json({ message: 'current user fetched', data: req.student });
}

async function updateProfile(req, res) {
  const profile = req.body;
  const studentId = req.student._id;
  try {
    const student = await Student.findOne({_id: studentId}).select('-password').exec();
    student.profile = profile;
    await student.save();
    res.status(401).json({
      message: "profile updated",
      data: student
    })
  } catch (e) {
    const errors = getErrorsInArray(e);
    res.status(403).json({
      message: "profile update failed",
      errors: errors
    })
  }
}

module.exports = {
  getUser,
  updateProfile
};

//*********************************************
function getErrorsInArray(e) {
  var arr = [];
  for (let field in e.errors) {
    arr.push({
      field: field,
      error: e.errors[field].message
    });
  }
  return arr;
}
