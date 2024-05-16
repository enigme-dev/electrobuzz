import { z } from "zod";

export function parseParams(searchParams: URLSearchParams) {
  let startDate, endDate;

  const query = searchParams.get("query") ?? "";
  const page = parseInt(searchParams.get("page") || "1");
  const skip = (page - 1) * 10;

  const startDateParam = z.coerce
    .string()
    .date()
    .safeParse(searchParams.get("start-date"));
  if (startDateParam.success) {
    startDate = new Date(startDateParam.data);
    startDate.setHours(0o0, 0o0, 0o0);
  }

  const endDateParam = z
    .string()
    .date()
    .safeParse(searchParams.get("end-date"));
  if (endDateParam.success) {
    endDate = new Date(endDateParam.data);
    endDate.setHours(23, 59, 59);
  }

  return { query, page, skip, startDate, endDate };
}

export const SearchParams = z.object({
  query: z.string().default("").optional(),
  page: z.number().default(1).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

export type SearchParams = z.infer<typeof SearchParams>;

export const ResponseSchema = z.object({
  status: z.string().optional(),
  data: z.any().optional(),
  perpage: z.number().optional(),
  length: z.number().optional(),
  total: z.number().optional(),
  page: z.number().optional(),
});

export const IdParam = z.object({
  params: z.object({
    id: z.string().cuid(),
  }),
});

export type IdParam = z.infer<typeof IdParam>;

export type ResponseSchema = z.infer<typeof ResponseSchema>;

export function buildRes(response: ResponseSchema) {
  const length =
    response.data instanceof Array ? response.data.length : undefined;
  const perpage = length ? 10 : undefined;

  return Response.json({ ...response, length, perpage });
}

export function fileInputToDataURL(
  fileInput: HTMLInputElement
): Promise<string> {
  return new Promise((resolve, reject) => {
    // Ensure files are selected
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      reject(new Error("No files selected."));
      return;
    }

    const file = fileInput.files[0];

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to read file."));
      }
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file."));
    };

    reader.readAsDataURL(file);
  });
}
