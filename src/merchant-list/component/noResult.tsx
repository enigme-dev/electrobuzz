import Image from "next/image";
import { useInstantSearch } from "react-instantsearch";

export function NoResults() {
  const { indexUiState } = useInstantSearch();

  return (
    <div className="flex flex-col justify-center items-center h-full">
      <Image
        src={"/Feeling sorry-cuate.svg"}
        alt="feelingSorryCuate"
        height={200}
        width={200}
      />

      <p>
        Tidak ada hasil untuk <q>{indexUiState.query}</q>.
      </p>
    </div>
  );
}
