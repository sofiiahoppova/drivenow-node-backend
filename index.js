import express from "express";
import userRoute from "./routes/userRoute.js";
import priceRoute from "./routes/priceRoute.js";

import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();
const port = 3000;

app.use(express.json());

app.use("/users", userRoute);
app.use("/prices", priceRoute);

app.use("/*splat", notFoundHandler);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
