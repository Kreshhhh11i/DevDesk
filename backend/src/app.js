import express from "express";
import morgan from "morgan";
const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.get("/health", (req, res) => {
    res.json("Dev desk server is running")
})
app.get("/notfound", (req, res) => {
    res.status(404).json("404 not found")
})
app.post("/test", (req, res) => {
    const response = req.body;
    res.status(200).json(response);
})
export default app;
