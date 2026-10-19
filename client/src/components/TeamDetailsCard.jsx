import React from "react";

export const TeamDetailsCard = ({
  name,
  email,
  role,
  status,
  isEditing,
  formdata,
  onChange,
  edit,
  save,
  cancel,
  ondelete,
  onTeam,
  onSave,
  isDeleting,
}) => {
  return (
    <div>
      {isEditing ? (
        <>
          <div>
            <label>Name</label>
            <input
              name="name"
              value={formdata.name}
              onChange={onChange}
            />
          </div>

          <div>
            <label>Email</label>
            <input
              name="email"
              type="email"
              value={formdata.email}
              onChange={onChange}
            />
          </div>

          <div>
            <label>Role</label>
            <select
              name="role"
              value={formdata.role}
              onChange={onChange}
            >
              <option value="admin">Admin</option>
              <option value="agent">Agent</option>
              <option value="user">User</option>
            </select>
          </div>

          <div>
            <label>Status</label>
            <select
              name="status"
              value={formdata.status}
              onChange={onChange}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <button onClick={save} disabled={onSave}>
            {onSave ? "Saving..." : "Save"}
          </button>

          <button onClick={cancel} disabled={onSave}>
            Cancel
          </button>
        </>
      ) : (
        <>
          <p>{name}</p>
          <p>{email}</p>
          <p>{role}</p>
          <p>{status}</p>

          <button onClick={edit}>Edit</button>

          <button onClick={ondelete} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete"}
          </button>

          <button onClick={onTeam}>Team</button>
        </>
      )}
    </div>
  );
};