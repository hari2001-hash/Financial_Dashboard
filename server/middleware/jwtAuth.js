const jwt = require('jsonwebtoken');

function jwtAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: "No token provided" });
  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET || "your-secret-key", (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    req.user = decoded;
    next();
  });
}

module.exports = jwtAuth;