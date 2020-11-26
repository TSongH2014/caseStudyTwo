import http from "../http-common"

const getAll = () => {
    return http.get("");
};

const create = data => {
    return http.post("", data);
}

const update = (id, data) => {
    return http.put(`/${id}`, data);
}

const remove = id => {
    return http.delete(`/${id}`);
}

export default {
    getAll,
    create,
    update,
    remove
}

export const getStatusCollection = () => ([
    { status: 'New' },
    { status: 'Old' },
    { status: 'Unused' },
    { status: 'Sold' },
])