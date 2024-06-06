import express from "express";
import dotenv from "dotenv";
import userRouter from "./router/userRouter.js";
import categoryRouter from "./router/categoryRouter.js";
import productRouter from "./router/productRouter.js";
import cartRouter from "./router/cartRouter.js";
import { handleErrorResponse } from "./error/errorHandler.js";
import path from "path";
import fileUpload from "express-fileupload";

dotenv.config();
const app = express();

app.use(express.json());

app.use(fileUpload({
  createParentPath: true
}));

app.use("/uploads", express.static(path.join("uploads")));

app.use("/user", userRouter);
app.use("/category", categoryRouter);
app.use("/product", productRouter);
app.use("/cart", cartRouter);

app.use(handleErrorResponse);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
