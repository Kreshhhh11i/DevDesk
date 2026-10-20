import React from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ isOpen }) => {
  return (
    <>
      <div
        className={`${isOpen ? "flex" : "hidden"}  md:flex flex-col justify-around h-screen p-10 border border-black`}
      >
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/tasks">Tasks</Link>
        <Link to="/team/members">Members</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/notifications">Notifications</Link>
        <Link to="/settings">Settings</Link>
        
      </div>
    </>
  );
};

export default Sidebar;
