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

function getMemberId(value) {
  const id = Number(value);

  if (!Number.isInteger(id) || id < 1) {
    return null;
  }

  return id;
}

router.get("/member/:id", (req, res) => {
  const id = getMemberId(req.params.id);

  if (id === null) {
    return res.status(400).json({ error: "Member ID must be a positive integer" });
  }

  const member = members.find((item) => item.id === id);

  if (!member) {
    return res.status(404).json({ error: "Member not found" });
  }

  res.json(member);
});

router.patch("/member/:id", (req, res) => {
  const id = getMemberId(req.params.id);

  if (id === null) {
    return res
      .status(400)
      .json({ error: "Member ID must be a positive integer" });
  }
  try {
    const member = members.find((item) => item.id === id);

    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }
    member.name = req.body.name;
    member.email = req.body.email;
    member.role = req.body.role;
    member.status = req.body.status;

    res.json(member);
  } catch (error) {
    console.log(error);

  }

});

router.delete("/member/:id", (req, res) => {
  const id = getMemberId(req.params.id);

  if (id === null) {
    return res.status(400).json({ error: "Member ID must be a positive integer" });
  }

  const memberIndex = members.findIndex((m) => m.id === id);

  if (memberIndex === -1) {
    return res.status(404).json({ error: "Member not found" });
  }

  const [deletedMember] = members.splice(memberIndex, 1);
  res.json(deletedMember);
});

export default router;