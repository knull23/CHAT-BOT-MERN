import app from "./app.js";
import { connectToDatabase } from "./db/connection.js";
import dotenv from "dotenv";
import cors from "cors";

// Load environment variables from the .env file
dotenv.config();

const PORT = process.env.PORT || 5000;

// Enable CORS to allow requests from the frontend
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000"; // Update with your frontend URL for production

app.use(
  cors({
    origin: frontendUrl, // Allow the frontend's URL (use the Render frontend URL in production)
    credentials: true,    // Allow cookies to be sent with requests
  })
);

// Connections and listeners
connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is open and connected to the database on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
  });
