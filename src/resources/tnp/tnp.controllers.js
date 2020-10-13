function getTnpUser(req, res) {
    return res
      .status(200)
      .json({ message: 'current user fetched', data: req.tnp });
  }
  
  module.exports = {
    getTnpUser
  };
  