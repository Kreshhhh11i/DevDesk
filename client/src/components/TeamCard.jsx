import React from "react";

const TeamCard = ({ name, email, role, status }) => {
  return (
    <div className="p-10 border border-amber-100 rounded-3xl shadow-2xl">
      <p>{name}</p>
      <p>{email}</p>
      <p>{role}</p>
      <p>{status}</p>
    </div>
  );
};

export default TeamCard;
