import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTaskById, updateTask, deleteTask } from "../services/taskServices";
import TaskDetailsCard from "../components/TaskDetailsCard";
import Input from "../components/Input";
import { AppleSpinner } from "../components/AppleSpinner";

const TasksDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [isEditing, setisEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [formData, setformData] = useState({
    title: "",
    description: "",
    status: "",
    priority: "",
    dueDate: "",
    category: "",
  });

  const fields = [
    "title",
    "description",
    "status",
    "priority",
    "dueDate",
    "category",
  ];

  const fetchData = async () => {
    try {
      const data = await getTaskById(id);
      setTask(data);
      setLoading(false);
      setError("");
    } catch (error) {
      setTask(null);
      console.log(error);
      setError("Failed to fetch task");
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [id]);

  const onEdit = () => {
    setisEditing(true);
    setformData({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
      category: task.category,
    });
  };

  const onCancel = () => {
    setisEditing(false);
  };
  const onSave = async () => {
    setIsSaving(true);
    try {
      const data = await updateTask(id, formData);
      setTask(data);
      setisEditing(false);
      navigate("/tasks");
    } catch (error) {
      console.log(error);
      setSaveError("Unable to update task");
    } finally {
      setIsSaving(false);
    }
  };

  const onDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteTask(id);
      navigate("/tasks");
    } catch (error) {
      console.log(error);
      setDeleteError("Cannot delete task");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      {loading ? (
        <AppleSpinner />
      ) : error !== "" ? (
        <h1>{error}</h1>
      ) : isEditing ? (
        <>
          {fields.map((field) =>
            field === "status" ? (
              <select
                key={field}
                value={formData.status}
                onChange={(e) =>
                  setformData({
                    ...formData,
                    status: e.target.value,
                  })
                }
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            ) : field === "priority" ? (
              <select
                key={field}
                value={formData.priority}
                onChange={(e) =>
                  setformData({
                    ...formData,
                    priority: e.target.value,
                  })
                }
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            ) : (
              <Input
                key={field}
                value={formData[field]}
                onChange={(e) =>
                  setformData({
                    ...formData,
                    [field]: e.target.value,
                  })
                }
              />
            ),
          )}
          {saveError && <p>{saveError}</p>}
          <button onClick={onCancel}>Cancel</button>
          {isSaving === false ? (
            <button onClick={onSave}>Save</button>
          ) : (
            <button disabled>
              <AppleSpinner />
            </button>
          )}
        </>
      ) : (
        <TaskDetailsCard
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          isDeleting={isDeleting}
          deleteError={deleteError}
        />
      )}
    </div>
  );
};

export default TasksDetails;
