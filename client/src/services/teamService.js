import api from "./api";

export async function getAllTeam(page, limit) {
    const response = await api.get("/team/members", { params: { page: page, limit: limit } });
    return response.data;
}