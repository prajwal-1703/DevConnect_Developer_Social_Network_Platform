import { validationResult } from "express-validator";

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};




/*

Perfect 💯 let’s wrap the backend properly so it’s **production-ready** before jumping to frontend.
Here’s the checklist we need to complete:

---

## ✅ 1. Authentication Middleware (JWT)

We need to protect routes like posts, projects, messaging, etc.

📂 `middleware/auth.js`

```js
import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id: user._id }
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
```

---

## ✅ 2. Validation Middleware

For inputs (username, email, etc.).

📂 `middleware/validate.js`

```js
import { validationResult } from "express-validator";

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
```

Example usage in `user.routes.js`:

```js
import { body } from "express-validator";
import { validate } from "../middleware/validate.js";

router.post(
  "/register",
  [
    body("username").isLength({ min: 3 }),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
  ],
  validate,
  registerUser
);
```
    
---

## ✅ 3. File Uploads (Images)

For profile pictures & post images.

📂 `middleware/upload.js`

```js
import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

export const upload = multer({ storage });
```

Example in `post.routes.js`:

```js
router.post("/", authMiddleware, upload.single("image"), createPost);
```

---

## ✅ 4. Real-Time Updates (Optional but powerful 🚀)

For instant messaging + notifications → use **Socket.IO**.

📂 `server.js` (update)

```js
import { Server } from "socket.io";

const io = new Server(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("sendMessage", (data) => {
    // forward message to receiver
    io.to(data.receiverId).emit("receiveMessage", data);
  });

  socket.on("join", (userId) => {
    socket.join(userId); // so we can target this user
  });
});
```

---

## ✅ 5. Testing (Postman Collection)

* Register/Login → get token
* Use token in **Authorization: Bearer <token>**
* Test posts, comments, follows, notifications, messages

---

⚡ With these additions, your **backend is complete & production-ready**.

---

👉 Next: Shall I prepare the **React frontend file structure + setup steps** so we can connect it with this backend?

*/