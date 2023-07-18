const authenticateUser = (req, res, next) => {
  if (!req.session.userId) {
    return res
      .status(401)
      .json({ message: "You must be logged in to view this page. " +  req.session.userId});
  }
  next();
};

module.exports = {
  authenticateUser,
};
