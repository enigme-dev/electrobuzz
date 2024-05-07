import { z } from "zod";

export function parseParams(searchParams: URLSearchParams) {
  const query = searchParams.get("query") ?? "";
  const page = parseInt(searchParams.get("page") ?? "1");
  const skip = (page - 1) * 10;

  return { query, page, skip };
}

export const SearchParams = z.object({
  query: z.string().default("").optional(),
  page: z.number().default(1).optional(),
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
