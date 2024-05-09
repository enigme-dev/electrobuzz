import axios, { AxiosResponse } from "axios";

interface ApiResponse {
  status: string;
  data: string[];
  response?: any;
}

export const updateData = async (url: string, data: any) => {
  try {
    const response: AxiosResponse<ApiResponse> = await axios.patch(url, data);
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      return error.response;
    }
  }
};

export const getData = async <T>(url: string) => {
  try {
    const response: AxiosResponse<ApiResponse> = await axios.get(url);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      return error.response;
    }
  }
};

export const postData = async <T>(url: string, data: T) => {
  try {
    const response: AxiosResponse<ApiResponse> = await axios.post(url, data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      return error.response;
    }
  }
};
