
function TeamDetailsCard({
  name,
  email,
  role,
  status,
  isEditing,
  formdata,
  onChange,
  onEdit,
  onSave,
  onCancel,
  onDeleteClick,
  isSaving,
  message,
}) {
  return (
    <div>
      {isEditing ? (
        <div>
          <h2>Edit Team Member</h2>

          <label>
            Name
            <input
              name="name"
              value={formdata.name}
              onChange={onChange}
            />
          </label>

          <label>
            Email
            <input
              name="email"
              type="email"
              value={formdata.email}
              onChange={onChange}
            />
          </label>

          <label>
            Role
            <input
              name="role"
              value={formdata.role}
              onChange={onChange}
            />
          </label>

          <label>
            Status
            <select
              name="status"
              value={formdata.status}
              onChange={onChange}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </label>

          <button onClick={onSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save"}
          </button>

          <button onClick={onCancel} disabled={isSaving}>
            Cancel
          </button>
        </div>
      ) : (
        <div>
          <h2>{name}</h2>
          <p>Email: {email}</p>
          <p>Role: {role}</p>
          <p>Status: {status}</p>

          <button onClick={onEdit}>Edit</button>

          <button onClick={onDeleteClick}>
            Delete
          </button>
        </div>
      )}

      {message && <p role="alert">{message}</p>}
    </div>
  );
}

export default TeamDetailsCard;
