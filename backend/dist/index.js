import app from "./app.js";
import { connectToDatabase } from "./db/connection.js";
import dotenv from "dotenv";
// Load environment variables from the .env file
dotenv.config();
const PORT = process.env.PORT || 5000;
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
//# sourceMappingURL=index.js.map