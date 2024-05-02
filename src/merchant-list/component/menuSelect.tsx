import { useMenu, UseMenuProps } from "react-instantsearch";
import { Select } from "../../core/components/ui/select";

export function MenuSelect(props: UseMenuProps) {
  const { items, refine } = useMenu(props);
  const { value: selectedValue } = items.find((item) => item.isRefined) || {
    value: "",
  };

  return (
    <select
      value={selectedValue}
      onChange={(event) => {
        refine((event.target as HTMLSelectElement).value);
      }}
      className="border rounded-lg p-2 w-full"
    >
      <option value={""}>All</option>
      {items.map((item, index) => (
        <option key={index} value={item.value}>
          {item.label}
        </option>
      ))}
    </select>
  );
}
