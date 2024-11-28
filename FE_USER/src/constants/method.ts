/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { API_URL } from './utils';
import { useSelector } from 'react-redux';

interface IProps {
  url: string;
  method: string;
  data?: any;
  token?: any;
}

const REQUEST_API = async ({ method, url, data, token }: IProps) => {
  //   const Token = await AsyncStorage.getItem(ASYN.token);
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    // "Access-Control-Allow-Origin": "*",
  };
  const config = { method, url, data, headers };
  try {
    const res = await axios(config);
    if (res.status === 200) {
      return res.data;
    }
  } catch (e) {
    if (String(e).indexOf("Network Error") !== -1) {
      throw new Error("Không có internet");
    }
    else {
      throw new Error();
    }
  }
};
export {REQUEST_API};