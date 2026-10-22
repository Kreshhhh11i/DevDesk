
import app from './app.js';
import dotenv from "dotenv";
dotenv.config();
const port = process.env.port || 8000;

app.listen(port, () => {
    console.log(`DevDesk server running in ${port}`);
})