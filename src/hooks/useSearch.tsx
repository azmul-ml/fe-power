import { useSearch } from "@/state/search";
import { useLocation } from "react-router-dom";
import qs from "query-string";

/**
 * Hook for returning location search
 * @dynamic
 * @hook {function}
 */
export default function useSearchParams() {
  const location = useLocation();

  const { search } = useSearch((state: any) => {
    return {
      search: state.search,
    };
  });

  const searchQueries: any = { ...qs.parse(location.search), ...qs.parse(search) };
  searchQueries["_page"] = searchQueries?.page ?? 1;
  searchQueries["_limit"] = searchQueries?.limit ?? 20;

  delete searchQueries.tableColumns;
  delete searchQueries?.page;
  delete searchQueries?.limit;

  return searchQueries;
}
