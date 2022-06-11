import express from "express";
const app = express();
import dotenv from "dotenv";
import cors from "cors";



dotenv.config();
import "express-async-errors";
import morgan from "morgan";
import fileUpload  from "express-fileupload";




import helmet from "helmet";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";
import rateLimiter  from 'express-rate-limit';

// swagger documentation
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
const swaggerDocument = YAML.load("./swagger.yaml");


// hello
// db and authenticateUser
import connectDB from "./db/connect.js";

// routers
import authRouter from "./routes/authRoutes.js";
import hotelsRouter from "./routes/hotels.js";
import userRouter from "./routes/userRoutes.js";

// middleware
import notFoundMiddleware from "./middleware/not-found.js";
import errorHandlerMiddleware from "./middleware/error-handler.js";

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(mongoSanitize());

// swagger documentation
app.get("/", (req, res) => {
  res.send(
    "<h1>Welcome to Hotel Reservia API</h1><br><a href='/api-docs'>Documetation</a>"
  );
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.static("public"));

app.use(fileUpload())
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/hotels", hotelsRouter);
app.use("/api/v1/users", userRouter);


// only when ready to deploy
// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, './build', 'index.html'))
// })

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
