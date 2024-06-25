import { twMerge } from "tailwind-merge";

export default function StatusBadge({ status }: { status: string }) {
  let style = "";

  switch (status) {
    case "pending":
      style = "text-blue-700 bg-blue-200";
      break;
    case "rejected":
      style = "text-red-700 bg-red-200";
      break;
    case "verified":
      style = "text-green-700 bg-green-200";
      break;
    case "suspended":
      style = "text-slate-700 bg-slate-200";
      break;
  }

  return (
    <div
      className={twMerge(
        "px-2 py-1 rounded-full text-[13px] min-w-[64px]",
        style
      )}
    >
      <span>{status}</span>
    </div>
  );
}
