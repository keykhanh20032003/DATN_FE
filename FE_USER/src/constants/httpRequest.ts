import axios from 'axios';
import { API_URL } from './utils';

//thiết lập cấu hình mặc định cho các yêu cầu http request
const httpRequest = axios.create({
    baseURL: API_URL,
    headers: {
        'content-type': 'application/json',
    },
});

export default httpRequest;