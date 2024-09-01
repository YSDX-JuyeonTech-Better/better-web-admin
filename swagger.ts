import { OpenAPIV3 } from "openapi-types";
import swaggerJsdoc from "swagger-jsdoc";

const swaggerDefinition: OpenAPIV3.Document = {
  openapi: "3.0.0",
  info: {
    title: "My API",
    version: "1.0.0",
    description: "API documentation for my project",
  },
  servers: [
    {
      url: "http://localhost:4000",
      description: "Local server",
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./app/api/**/*.ts"], // 주석이 있는 파일 경로
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
