import { twMerge } from "tailwind-merge";

export default function StatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  let style = "";

  switch (status) {
    case "pending":
      style =
        "text-blue-700 bg-blue-200 dark:text-blue-500 dark:bg-blue-600/40";
      break;
    case "rejected":
      style = "text-red-700 bg-red-200 dark:text-red-500 dark:bg-red-600/40";
      break;
    case "verified":
      style =
        "text-green-700 bg-green-200 dark:text-green-500 dark:bg-green-600/40";
      break;
    case "suspended":
      style =
        "text-slate-700 bg-slate-200 dark:text-slate-500 dark:bg-slate-600/40";
      break;
  }

  return (
    <div
      className={twMerge(
        "px-2 py-1 rounded-full text-[13px] min-w-[64px] font-medium",
        style,
        className
      )}
    >
      <span>{status}</span>
    </div>
  );
}
