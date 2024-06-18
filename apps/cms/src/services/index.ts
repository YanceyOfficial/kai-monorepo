import axios from "axios";

axios.defaults.baseURL = "http://127.0.0.1";

export const createWordList = axios.post("/word");

export const findAllWordList = axios.get("/word");
