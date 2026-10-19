import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import {
  getMemberById,
  updateMember,
  deleteMember,
} from "../services/teamService";
import { TeamDetailsCard } from "../components/TeamDetailsCard";

const TeamDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data, loading, error } = useFetch(getMemberById, [id]);

  const [formdata, setFormdata] = useState({
    name: "",
    email: "",
    role: "",
    status: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [onSave, setOnSave] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState("");

  const handleEdit = () => {
    if (!data) return;

    setFormdata({
      name: data.name ?? "",
      email: data.email ?? "",
      role: data.role ?? "",
      status: data.status ?? "",
    });

    setMessage("");
    setIsEditing(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormdata((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setOnSave(true);
    setMessage("");

    try {
      await updateMember(id, formdata);

      setIsEditing(false);
      // Refresh the page data to show the saved values.
      navigate(0);
    } catch (error) {
      console.error("Failed to update member:", error);
      setMessage("Failed to update member. Please try again.");
    } finally {
      setOnSave(false);
    }
  };

  const handleCancel = () => {
    setFormdata({
      name: data?.name ?? "",
      email: data?.email ?? "",
      role: data?.role ?? "",
      status: data?.status ?? "",
    });

    setIsEditing(false);
    setMessage("");
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setMessage("");

    try {
      await deleteMember(id);
      navigate("/team/members");
    } catch (error) {
      console.error("Failed to delete member:", error);
      setMessage("Failed to delete member. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) return <p>Loading member details...</p>;
  if (error) return <p>Failed to load member details.</p>;
  if (!data) return <p>Member not found.</p>;

  return (
    <>
      <TeamDetailsCard
        name={data.name}
        email={data.email}
        role={data.role}
        status={data.status}
        isEditing={isEditing}
        formdata={formdata}
        onChange={handleChange}
        edit={handleEdit}
        save={handleSave}
        cancel={handleCancel}
        ondelete={handleDelete}
        onTeam={() => navigate("/team/members")}
        onSave={onSave}
        isDeleting={isDeleting}
      />

      {message && <p>{message}</p>}
    </>
  );
};

export default TeamDetails;