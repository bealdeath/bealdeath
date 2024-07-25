const verifyRole = (roles) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    if (roles.includes(userRole)) {
      next();
    } else {
      res.status(403).json({ error: 'Forbidden' });
    }
  };
};

module.exports = verifyRole;
