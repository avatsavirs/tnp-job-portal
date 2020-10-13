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
    const student = await Student.findOne({_id: studentId}).exec();
    student.profile = profile;
    await student.save();
    res.status(401).json({
      message: "profile updated",
      data: student
    })
  } catch (e) {
    res.status(403).json({
      message: "profile update failed",
      errors: e.message
    })
  }
}
module.exports = {
  getUser,
  updateProfile
};
