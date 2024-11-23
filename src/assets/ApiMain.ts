import axios from "axios";

const ApiMain = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL, 
});

export default ApiMain;
