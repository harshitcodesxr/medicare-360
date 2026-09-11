const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.userRole) {
      return res.status(401).json({ message: 'User role not found' });
    }

    if (!allowedRoles.includes(req.userRole)) {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }

    next();
  };
};

module.exports = roleMiddleware;