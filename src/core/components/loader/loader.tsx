import { twMerge } from "tailwind-merge";

export default function Loader({ className }: { className?: string }) {
  return (
    <div
      className={twMerge(
        "w-[100%] h-[70vh] flex justify-center items-center",
        className
      )}
    >
      <div
        className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-yellow-400 border-e-transparent align-[-0.125em] text-warning motion-reduce:animate-[spin_1.5s_linear_infinite]"
        role="status"
      ></div>
    </div>
  );
}
