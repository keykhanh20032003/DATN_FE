import axios from 'axios';

const provinceRequest = axios.create({
    baseURL: 'https://provinces.open-api.vn/',
    headers: {
        'content-type': 'application/json',
    },
});

export default provinceRequest;