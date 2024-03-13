import { TwilioClient } from "@/core/adapters/twilio";

export function parsePhone(phone: string) {
  if (phone.startsWith("0")) {
    return "+62" + phone.substring(1, phone.length);
  }
  return phone;
}

export async function sendOTP(phone: string) {
  phone = parsePhone(phone);

  return TwilioClient.verify.v2
    .services(process.env.TWILIO_SERVICE_ID)
    .verifications.create({ to: phone, channel: "whatsapp" });
}

export async function checkOTP(phone: string, code: string) {
  phone = parsePhone(phone);

  return TwilioClient.verify.v2
    .services(process.env.TWILIO_SERVICE_ID)
    .verificationChecks.create({ to: phone, code: code });
}
