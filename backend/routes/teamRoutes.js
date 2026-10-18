import express, { Router } from "express";
import { members } from "../data/team.js";



const router = express.Router();

// router.get("/members", (req, res) => {
//     res.json(members);
// })
router.get("/members", (req, res) => {
  const totalTeam = members.length;
  const page = Number(req.query.page);
  const limit = Number(req.query.limit);
  const start = (page - 1) * limit;
  const totalPages = Math.ceil(totalTeam / limit);
  const slicedTeam = members.slice(start, start + limit);


  res.json({ Team: slicedTeam, page, totalTeam, totalPages });
});

export default router;