import express, { Router } from "express";
import { members } from "../data/team.js";


const router = express.Router();

router.get("/members", (req, res) => {
    res.json(members);
})

export default router;