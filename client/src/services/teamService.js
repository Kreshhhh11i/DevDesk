import api from "./api";

export async function getAllTeam(page, limit) {
    const response = await api.get("/team/members", { params: { page: page, limit: limit } });
    return response.data;
}

export async function getMemberById(id) {
    const response = await api.get(`/team/member/${id}`)
    return response.data;
}

export async function updateMember(id, formData) {
    const response = await api.patch(`/team/member/${id}`, formData);
    return response.data
}

export async function deleteMember(id) {
    const response = await api.delete(`/team/member/${id}`);
    return response.data;

}