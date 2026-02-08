import jwt from "jsonwebtoken";

const isAuth = async(req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: "No token provided",
      })
    }
    
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        message: "Token is not found",
      })
    }
    
    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = verifyToken.userId;
    next();
    
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({
      message: "Invalid or expired token",
    })
  }
}

export default isAuth;