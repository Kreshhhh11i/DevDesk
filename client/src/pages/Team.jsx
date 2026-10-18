import React, { useEffect, useState } from "react";
import { getAllTeam } from "../services/teamService";
import useFetch from "../hooks/useFetch";
import { useDebounce } from "../hooks/useDebounce";

import TeamCard from "../components/TeamCard";
import { Link } from "react-router-dom";
import Input from "../components/Input";

const Team = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const { data, error, loading } = useFetch(getAllTeam, [page, limit]);
  const { debouncedSearch } = useDebounce(search, 500);
  const [role, setRole] = useState("all");
  const [sort, setSort] = useState("default");

  const filteredTeam = (data?.Team ?? []).filter((t) => {
    return (
      (t.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        t.email.toLowerCase().includes(debouncedSearch.toLowerCase())) &&
      (role === "all" || t.role.toLowerCase() === role)
    );
  });

  const sortedTeam =
    sort === "default"
      ? filteredTeam
      : [...filteredTeam].sort((a, b) => {
          if (sort === "ascending") {
            return a.name.localeCompare(b.name);
          } else {
            return b.name.localeCompare(a.name);
          }
        });

  useEffect(() => {
    if (data) {
      setTotalPages(data.totalPages);
    }
  }, [data]);
  useEffect(() => {
    console.log(data);
  }, [data]);

  const handleNext = () => {
    if (page < totalPages) {
      const next = page + 1;
      setPage(next);
    }
  };
  const handlePrevious = () => {
    if (page > 1) {
      const previous = page - 1;
      setPage(previous);
    }
  };
  return (
    <>
      <div className="flex">
        <Input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
        <select
          value={role}
          onChange={(e) => {
            setRole(e.target.value);
          }}
        >
          <option value="all">All</option>
          <option value="admin">Admin</option>
          <option value="agent">Agent</option>
          <option value="user">user</option>
        </select>
        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
          }}
        >
          <option value="default">Default</option>
          <option value="ascending">Acending</option>
          <option value="descending">Descending</option>
        </select>

        <button onClick={handlePrevious} disabled={page === 1}>
          Previous
        </button>
        <p>{page}</p>
        <button onClick={handleNext} disabled={page === totalPages}>
          Next
        </button>
        
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {data ? (
          sortedTeam.map((t) => {
            return (
              <Link key={t.id}>
                <TeamCard
                  name={t.name}
                  email={t.email}
                  role={t.role}
                  status={t.status}
                />
              </Link>
            );
          })
        ) : (
          <h1>error fetching team</h1>
        )}
      </div>
    </>
  );
};

export default Team;
