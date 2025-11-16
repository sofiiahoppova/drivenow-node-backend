import createHttpError from "http-errors";
import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    const error = createHttpError(401, "Authorization token is not provided");
    next(error);
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      const error = createHttpError(403, "Forbidden", { message: err.message });
      next(error);
    }
    req.user = user;
    next();
  });
};
