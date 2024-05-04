import axios from "axios";

export function parsePhone(phone: string) {
  if (phone.startsWith("0")) {
    return "62" + phone.substring(1, phone.length);
  }
  return phone;
}

export async function SendMessage(phoneNumber: string, message: string) {
  phoneNumber = parsePhone(phoneNumber);

  return axios.post(process.env.WATZAP_ENDPOINT as string, {
    api_key: process.env.WATZAP_API_KEY,
    number_key: process.env.WATZAP_NUMBER_KEY,
    phone_no: phoneNumber,
    message,
  });
}
