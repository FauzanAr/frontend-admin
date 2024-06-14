import axios from 'axios';
import { config } from '../config';

const baseApi = axios.create({
    baseURL: config.baseUrl
});

export default baseApi