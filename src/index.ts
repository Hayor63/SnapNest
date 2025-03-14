import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import morgan from "morgan";
import connect from "./database/connection";
import swaggerJSDoc from "swagger-jsdoc";
import * as swaggerUi from "swagger-ui-express";
import express, { Response } from "express";
import config from "../config/default";
import deserialize from "./middleware/deserializeUser";
import router from "./routes/v1";

const app = express();

const port = config.port;

// Swagger API documentation setup

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "SnapNest API Documentation",
    version: "1.0.0",
    description: "Comprehensive API documentation for the SnapNest application built with TypeScript"
  },
  servers: [
    {
      url: "http://localhost:9000",
      description: "Development Server",
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT", // Optional, indicates the token type
      },
    },
  },
  security: [
    {
      BearerAuth: [],
    },
  ],
};

const options = {
    swaggerDefinition,
    apis: [
      "./src/routes/*.ts", // Matches: /routes/users.ts
      "./src/routes/**/*.ts",
      "./src/routes/v1/**/*.ts",
    ],
  };

const swaggerSpec = swaggerJSDoc(options);

//  CORS configuration to allow cross-origin requests

var corOptions = {
  origin: "*", 
  methods: ["GET", "POST", "PUT", "DELETE"], 
  allowedHeaders: ["Content-Type", "Authorization"], 
  credentials: true, 
  setHeaders: function (res: Response, path: string, stat: any) {
    res.setHeader("Cache-Control", "s-max-age=1, stale-while-revalidate");
  },
};

// Middleware setup
app.use(express.json());
app.use(cors(corOptions)); 
app.use(express.urlencoded({ extended: true })); 
app.use(morgan("tiny")); 
app.disable("x-powered-by"); 

// Add default route for root URL
app.get("/", (req, res) => {
  res.json({ message: "API is running successfully!" });
});

//  Swagger UI route setup for API documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
//  Middleware for request deserialization
app.use(deserialize);
// Main API routes
app.use("/api/v1", router);

// Start the server and connect to the database
app.listen(port, "0.0.0.0", () => {
  console.log(`Server is connected to port: ${port}`);
  connect();
});

export default app;