import { useContext, useEffect, useState } from "react";
import Input from "../components/Input";
import { createTasks, getAllTasks } from "../services/taskServices";
import Card from "../components/Card";
import { Link, useSearchParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { useDebounce } from "../hooks/useDebounce";
import { NotificationContext } from "../context/NotificationContext";
import { AppleSpinner } from "../components/AppleSpinner";

const Tasks = () => {
  // states
  const [tasks, setTasks] = useState({
    title: "",
    description: "",
    status: "pending",
    priority: "low",
    dueDate: "",
    category: "",
  });
  const [taskList, setTaskList] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const { data, error, loading } = useFetch(getAllTasks, [currentPage, limit]);
  const { debouncedSearch } = useDebounce(search, 1000);
  const { showNotification } = useContext(NotificationContext);
  useEffect(() => {
    if (data) {
      setTaskList(data.tasks);
      setTotalPages(data.totalPages);
    }
  }, [data]);
  // filter tasks
  const filteredTask = taskList.filter((task) => {
    return (
      task.title.toLowerCase().includes(debouncedSearch.toLowerCase()) &&
      (statusFilter === "all" || task.status === statusFilter) &&
      (priorityFilter === "all" || task.priority === priorityFilter)
    );
  });

  // sorting tasks

  let priorityNumber = {
    high: 3,
    medium: 2,
    low: 1,
  };

  const sortedTask = [...filteredTask].sort((a, b) => {
    if (sortBy === "priority") {
      return priorityNumber[b.priority] - priorityNumber[a.priority];
    } else if (sortBy === "dueDate") {
      return new Date(b.dueDate) - new Date(a.dueDate);
    } else {
      return 0;
    }
  });

  //pagination btn next and previous

  const handleNext = () => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
    }
  };
  const handlePrivious = () => {
    if (currentPage > 1) {
      const previousPage = currentPage - 1;
      setCurrentPage(previousPage);
    }
  };

  // useEffects

  useEffect(() => {
    setSearchParams((perv) => {
      const params = new URLSearchParams(perv);

      if (search) {
        params.set("search", search);
      } else {
        params.delete("search");
      }

      if (statusFilter !== "all") {
        params.set("status", statusFilter);
      } else {
        params.delete("status");
      }

      if (priorityFilter !== "all") {
        params.set("priority", priorityFilter);
      } else {
        params.delete("priority");
      }
      if (sortBy !== "default") {
        params.set("sort", sortBy);
      } else {
        params.delete("sort");
      }
      if (currentPage !== 1) {
        params.set("page", currentPage);
      } else {
        params.delete("page");
      }
      return params;
    });
  }, [search, statusFilter, priorityFilter, sortBy, currentPage]);

  useEffect(() => {
    const urlSearch = searchParams.get("search");
    const urlStatus = searchParams.get("status");
    const urlPriority = searchParams.get("priority");
    const urlSort = searchParams.get("sort");
    const urlPage = searchParams.get("page");
    const validPriorities = ["low", "medium", "high"];
    const validStatuses = ["all", "pending", "completed"];
    const validSorts = ["default", "newest", "oldest", "priority", "dueDate"];
    const pageNumber = Number(urlPage);
    setSearch(urlSearch || "");
    setStatusFilter(validStatuses.includes(urlStatus) ? urlStatus : "all");
    setPriorityFilter(
      validPriorities.includes(urlPriority) ? urlPriority : "all",
    );
    setSortBy(validSorts.includes(urlSort) ? urlSort : "default");

    setCurrentPage(
      Number.isInteger(pageNumber) && pageNumber > 0 ? pageNumber : 1,
    );
  }, [searchParams]);

  const handleForm = (e) => {
    const { name, value } = e.target;
    setTasks({
      ...tasks,
      [name]: value,
    });
  };

  //logs

  // functions

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await createTasks(tasks);

      setTasks({
        title: "",
        description: "",
        status: "pending",
        priority: "low",
        dueDate: "",
        category: "",
      });

      setTaskList([...taskList, data]);
      showNotification("Task created successfully", "success");
    } catch (error) {
      console.log(error.response.data);
      showNotification("Failed to create task", "error");
    }
  };

  if (loading) {
    return <AppleSpinner />;
  }
  if (error) {
    return <p>Failed to load tasks. Please try again.</p>;
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          name="title"
          placeholder="Title"
          value={tasks.title}
          onChange={handleForm}
        />
        <Input
          type="text"
          name="description"
          placeholder="Description"
          value={tasks.description}
          onChange={handleForm}
        />
        <Input
          type="text"
          name="status"
          placeholder="Status"
          value={tasks.status}
          onChange={handleForm}
        />
        <Input
          type="text"
          name="priority"
          placeholder="Priority"
          value={tasks.priority}
          onChange={handleForm}
        />
        <Input
          type="date"
          name="dueDate"
          value={tasks.dueDate}
          onChange={handleForm}
        />
        <Input
          type="text"
          name="category"
          placeholder="Category"
          value={tasks.category}
          onChange={handleForm}
        />
        <Input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />

        {/* task status */}
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
          }}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
        {/* task priority */}
        <select
          value={priorityFilter}
          onChange={(e) => {
            setPriorityFilter(e.target.value);
          }}
        >
          <option value="all">All</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        {/* sortBy */}
        <select
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value);
          }}
        >
          <option value="default">Default</option>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="priority">Priority</option>
          <option value="dueDate">Due Date</option>
        </select>

        <button type="submit">Create Task</button>
      </form>
      <button onClick={handleNext} disabled={currentPage === totalPages}>
        Next
      </button>
      <button onClick={handlePrivious} disabled={currentPage === 1}>
        Previous
      </button>
      {sortedTask.map((t) => {
        return (
          <Link key={t.id} to={`/tasks/${t.id}`}>
            {" "}
            <Card title={t.title} dueDate={t.dueDate} />
          </Link>
        );
      })}
    </div>
  );
};

export default Tasks;
