import axios from "axios";
require("dotenv").config();

const baseURL = process.env.REACT_APP_BACKEND_URL;

export const api = axios.create({
  baseURL: baseURL
});
