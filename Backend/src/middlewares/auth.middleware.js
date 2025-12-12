// import jwt from "jsonwebtoken";

// const authMiddleware = (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>

//   if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded; // { id: user._id }
//     next();
//   } catch (err) {
//     res.status(401).json({ msg: "Invalid token" });
//   }
// };

// export default authMiddleware;



import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.error("Auth failed: Missing or malformed token");
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select("-passwordHash");
    
      if (!user) {
        console.error(`Auth failed: User not found for ID ${decoded.id}`);
      return res.status(404).json({ msg: "User not found" });
    }
    
      // Ensure the user object has an id property that matches what the controllers expect
      req.user = user;
      req.user.id = user._id.toString();

    next();
  } catch (err) {
      console.error("Auth failed:", err.message);
    res.status(401).json({ msg: "Token is not valid" });
  }
};
