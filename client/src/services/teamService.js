import api from "./api";

export async function getAllTeam() {
    const response = await api.get("/team/members");
    return response.data;
}