import axios from "axios";

const ApiMain = axios.create({
  baseURL: 'https://www.registroreparacionesmantenmientos.somee.com/api', 
});

export default ApiMain;
