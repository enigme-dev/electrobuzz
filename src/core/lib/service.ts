import axios, { AxiosResponse } from "axios";

interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const updateData = async (
  url: string,
  data: any
): Promise<ApiResponse> => {
  try {
    const response: AxiosResponse<ApiResponse> = await axios.patch(url, data);
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response
        ? error.response.data.message
        : "An error occurred",
    };
  }
};

export const getData = async <T>(url: string): Promise<ApiResponse> => {
  try {
    const response: AxiosResponse<ApiResponse> = await axios.get(url);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response
        ? error.response.data.message
        : "An error occurred",
    };
  }
};

export const postData = async <T>(
  url: string,
  data: T
): Promise<ApiResponse> => {
  try {
    const response: AxiosResponse<ApiResponse> = await axios.post(url, data);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response
        ? error.response.data.message
        : "An error occurred",
    };
  }
};
