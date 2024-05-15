import { useInstantSearch } from "react-instantsearch";

export function NoResultsBoundary({ children, fallback }: any) {
  const { results } = useInstantSearch();
  if (!results.__isArtificial && results.nbHits === 0) {
    return (
      <>
        {fallback}
        <div hidden>{children}</div>
      </>
    );
  }

  return children;
}
