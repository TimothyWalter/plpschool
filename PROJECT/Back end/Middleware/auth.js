

function verifyTrader(req, res, next) {
  if (req.user && req.user.role === "trader") {
    next();
  } else {
    res.status(403).json({ error: "Access denied. Trader role required." });
  }
}

module.exports = { verifyToken, verifyTrader, verifyAdmin };


function verifyAdmin(req, res, next) {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ error: "Access denied. Admin role required." });
  }
}
