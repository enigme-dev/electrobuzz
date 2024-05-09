import { z } from "zod";

export function parseParams(searchParams: URLSearchParams) {
  let startDate, endDate;
  const query = searchParams.get("query") ?? "";
  const page = parseInt(searchParams.get("page") || "1");
  const skip = (page - 1) * 10;
  const startDateParam = z.coerce
    .date()
    .safeParse(searchParams.get("start-date"));
  if (startDateParam.success) {
    startDateParam.data.setHours(0o0, 0o0, 0o0);
    startDate = startDateParam.data;
  }
  const endDateParam = z.coerce.date().safeParse(searchParams.get("end-date"));
  if (endDateParam.success) {
    endDateParam.data.setHours(23, 59, 59);
    endDate = endDateParam.data;
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

export type ResponseSchema = z.infer<typeof ResponseSchema>;

export function buildRes(response: ResponseSchema) {
  const length =
    response.data instanceof Array ? response.data.length : undefined;
  const perpage = length ? 10 : undefined;

  return Response.json({ ...response, length, perpage });
}
