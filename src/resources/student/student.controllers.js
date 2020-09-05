function getUser(req, res) {
  return res
    .status(200)
    .json({ message: 'current user fetched', data: req.student });
}

module.exports = {
  getUser
};
