import clsx from "clsx";

interface CustomBadgeProps {
  title: string;
  status: "failed" | "success" | "no status";
}
const CustomBadge = ({ title, status }: CustomBadgeProps) => {
  const styleBadge = () => {
    switch (status) {
      case "failed":
        return "text-red-500 border border-red-500";
      case "success":
        return "text-green-500 border border-green-500";
      case "no status":
        return "border border-gray-300 text-gray-500";
    }
  };
  return (
    <div
      className={clsx(
        "rounded-lg  py-1 px-2 text-center font-medium uppercase text-xs md:text-sm",
        styleBadge()
      )}
    >
      {title}
    </div>
  );
};
export default CustomBadge;
