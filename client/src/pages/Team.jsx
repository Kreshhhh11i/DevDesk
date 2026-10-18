import React, { useEffect, useState } from "react";
import { getAllTeam } from "../services/teamService";
import useFetch from "../hooks/useFetch";
import { useDebounce } from "../hooks/useDebounce";

import TeamCard from "../components/TeamCard";
import { Link } from "react-router-dom";
import Input from "../components/Input";

const Team = () => {
  const [search, setSearch] = useState("");
  const { data, error, loading } = useFetch(getAllTeam, []);
  const { debouncedSearch } = useDebounce(search, 500);
  const [role, setRole] = useState("all");

  const filteredTeam = (data ?? []).filter((t) => {
  return (
    (t.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      t.email.toLowerCase().includes(debouncedSearch.toLowerCase())) &&
    (role === "all" || t.role.toLowerCase() === role)
  );
});

  useEffect(() => {
    console.log(data);
  }, [data]);
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
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {data ? (
          filteredTeam.map((t) => {
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
