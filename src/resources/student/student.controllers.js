const Student = require('./student.model');

function getUser(req, res) {
  return res
    .status(200)
    .json({ message: 'current user fetched', data: req.student });
}

async function updateAddress(req, res) {
  const userId = req.student._id;
  const address = req.body.address;
  try {
    const student = await Student.findById(userId);
    student.profile.address = address;
    await student.save();
    return res.status(200).json({
      data: student
    });
  } catch (e) {
    return res.status(401).json({
      data: "failed",
      message: e.message
    })
  }
}

module.exports = {
  getUser,
  updateAddress
};
