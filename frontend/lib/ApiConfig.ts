import axios from "axios";

const Axios = axios.create({
  baseURL:  `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, 
});

export default Axios;