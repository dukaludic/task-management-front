import axios from "axios";
import axiosInstance from "./axiosInstance";

export const create = async (resource, data, authContext) => {
  const result = await axiosInstance(authContext)
    .post(`${process.env.REACT_APP_API_URL}/${resource}`, {
      ...data,
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
    });
  return result;
};

export const show = async (resource, authContext) => {
  // const authContext = useContext(Auth);

  const result = await axiosInstance(authContext)
    .get(`${process.env.REACT_APP_API_URL}/${resource}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error;
    });
  return result;
};

export function showSingle(resource, _id, authContext) {
  const result = axiosInstance(authContext)
    .get(`${process.env.REACT_APP_API_URL}/${resource}/${_id}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
    });
  return result;
}

export function update(resource, _id, data, authContext) {
  const result = axiosInstance(authContext)
    .patch(`${process.env.REACT_APP_API_URL}/${resource}/${_id}`, {
      ...data,
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
    });

  return result;
}

export function deleteItem(resource, _id, authContext) {
  const result = axiosInstance(authContext)
    .delete(`${process.env.REACT_APP_API_URL}/${resource}/${_id}`)
    .then(console.log("DELETED"))
    .catch((error) => {
      console.log(error);
    });
}
