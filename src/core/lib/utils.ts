import cuid2, { init, createId } from "@paralleldrive/cuid2";
import { type NextRequest } from "next/server";

export function generateUsername(name?: string | null): string {
  const createShortId = init({
    random: Math.random,
    length: 6,
  });

  if (name) {
    const splitted = name.toLowerCase().split(" ");
    const username = splitted[0].slice(0, 6) + "-" + createShortId();
    return username;
  }

  return createId();
}

export interface PostQuery {
  author: string;
  startDate: string;
  endDate: string;
  page: number;
}

export function extractPostQuery(request: NextRequest): PostQuery {
  const searchParams = request.nextUrl.searchParams;
  const author = searchParams.get("author") ?? "";
  const startDate = searchParams.get("startDate") ?? "";
  const endDate = searchParams.get("endDate") ?? "";
  const page = parseInt(searchParams.get("page") ?? "1");

  const query: PostQuery = { author, startDate, endDate, page };
  return query;
}

export function generatePermalink(title: string) {
  const snakeCase = title
    .toLowerCase()
    .split(" ")
    .join("-")
    .replace(/[^a-z0-9-]/gi, "");

  const randomizer = cuid2.init({ random: Math.random, length: 6 });
  const randomId = randomizer();

  return snakeCase + "-" + randomId;
}
