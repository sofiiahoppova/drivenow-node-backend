import express from "express";
import userRoute from "./routes/userRoute.js";

const app = express();
const port = 3000;

app.use(express.json());

app.use("/users", userRoute);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
