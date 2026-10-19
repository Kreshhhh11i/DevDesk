
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import {
  getMemberById,
  updateMember,
  deleteMember,
} from "../services/teamService";
import TeamDetailsCard from "../components/TeamDetailsCard";

function TeamDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, loading, error } = useFetch(getMemberById, [id]);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [message, setMessage] = useState("");

  const [formdata, setFormdata] = useState({
    name: "",
    email: "",
    role: "",
    status: "",
  });

  // Open edit form
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

  // Update form fields
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormdata((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Save updated member
  const handleSave = async () => {
    setIsSaving(true);
    setMessage("");

    try {
      await updateMember(id, formdata);
      setIsEditing(false);
      navigate(0);
    } catch (error) {
      setMessage("Failed to update team member.");
    } finally {
      setIsSaving(false);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setIsEditing(false);
    setMessage("");
  };

  // Open confirmation modal only
  const openDeleteModal = () => {
    setMessage("");
    setIsDeleteModalOpen(true);
  };

  // Close confirmation modal
  const closeDeleteModal = () => {
    if (isDeleting) return;

    setIsDeleteModalOpen(false);
    setMessage("");
  };

  // Actually delete the member
  const handleDelete = async () => {
    setIsDeleting(true);
    setMessage("");

    try {
      await deleteMember(id);
      setIsDeleteModalOpen(false);

      // Change this path if your team listing route differs.
      navigate("/team/members");
    } catch (error) {
      setMessage("Failed to delete team member. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) return <p>Loading team member...</p>;

  if (error || !data) {
    return <p>Failed to load team member.</p>;
  }

  return (
    <div>
      <TeamDetailsCard
        name={data.name}
        email={data.email}
        role={data.role}
        status={data.status}
        isEditing={isEditing}
        formdata={formdata}
        onChange={handleChange}
        onEdit={handleEdit}
        onSave={handleSave}
        onCancel={handleCancel}
        onDeleteClick={openDeleteModal}
        isSaving={isSaving}
        message={!isDeleteModalOpen ? message : ""}
      />

      {/* Delete confirmation modal */}
      {isDeleteModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-modal-title"
        >
          <h2 id="delete-modal-title">Delete Team Member?</h2>

          <p>
            Are you sure you want to delete {data.name}?
            This action cannot be undone.
          </p>

          {message && <p role="alert">{message}</p>}

          <button
            type="button"
            onClick={closeDeleteModal}
            disabled={isDeleting}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Confirm Delete"}
          </button>
        </div>
      )}
    </div>
  );
}

export default TeamDetails;
