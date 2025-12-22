import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRoute from "./routes/userRoute.js";
import priceRoute from "./routes/priceRoute.js";
import carRoute from "./routes/carRoute.js";
import reviewRoute from "./routes/reviewRoute.js";
import bookingRoute from "./routes/bookingRoute.js";
import authRoute from "./routes/authRoute.js";

import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import { errorHandler } from "./middlewares/errorHandler.js";

export const app = express();
const port = 3000;

app.use(express.json());
app.use(
  cors({
    origin: ["https://drivenow-react-app.vercel.app"],
    credentials: true,
  })
);
app.use(cookieParser());

app.use("/users", userRoute);
app.use("/prices", priceRoute);
app.use("/cars", carRoute);
app.use("/reviews", reviewRoute);
app.use("/bookings", bookingRoute);
app.use("/", authRoute);

app.use("/*splat", notFoundHandler);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
