import axios from "axios";

export const create = async (resource, data, success, failure) => {
  const result = await axios
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

export const show = async (resource) => {
  const result = await axios
    .get(`${process.env.REACT_APP_API_URL}/${resource}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
    });

  return result;
};

export function showSingle(resource, id) {
  console.log(resource, id, "resource/id");
  const result = axios
    .get(`${process.env.REACT_APP_API_URL}/${resource}/${id}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
    });
  console.log(result, "===result");
  return result;
}

export function update(resource, id, data) {
  const result = axios
    .patch(`${process.env.REACT_APP_API_URL}/${resource}/${id}`, {
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

export function deleteItem(resource, id) {
  const result = axios
    .delete(`${process.env.REACT_APP_API_URL}/${resource}/${id}`)
    .then(console.log("DELETED"))
    .catch((error) => {
      console.log(error);
    });
}
