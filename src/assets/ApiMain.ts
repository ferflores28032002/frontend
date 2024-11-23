import axios from "axios";

const ApiMain = axios.create({
  baseURL: 'http://www.registroreparacionesmantenmientos.somee.com/api', 
});

export default ApiMain;
