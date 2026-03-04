import express from "express";
import jsonwebtoken from "jsonwebtoken";
import cookieParser from "cookie-parser";

const JWT_SECRET = "your_jwt_secret_key";

const roles = {
  admin: ["create", "read", "update", "delete"],
  user: ["read"],
};

export default function (app) {
  app.use(express.json());
  app.use(cookieParser());
  app.use("/", (req, res, next) => {
    console.log("Request received", req.method, req.url);
    // Logg our request to logg service
    next();
  });
}

export function authentication(req, res, next) {
  const authHeader = req.headers.authorization;

  console.log(req.cookies.accessToken);

  const tokenFromCookie = req.cookies.accessToken;
  if (!authHeader && !tokenFromCookie) {
    return res
      .status(401)
      .json({ message: "Authorization header or cookie missing" });
  }

  // authorization: "Bearer <token>" => ["Bearer", "<token>"] => "<token>"

  const token = authHeader ? authHeader.split(" ")[1] : tokenFromCookie;
  if (!token) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  try {
    const decoded = jsonwebtoken.verify(token, JWT_SECRET);
    req.user = decoded;
    console.log("Decoded JWT:", decoded);
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
}

export function authorize(permissions) {
  return (req, res, next) => {
    const permissionsForRole = roles[req.user.role] || [];

    const hasPermission = permissions.every((perm) =>
      permissionsForRole.includes(perm),
    );

    if (!hasPermission) {
      return res
        .status(403)
        .json({ message: "Forbidden: Insufficient permissions" });
    }
    next();
  };
}
