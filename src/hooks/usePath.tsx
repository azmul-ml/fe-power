import { useLocation } from "react-router-dom";

/**
 * Hook for checking a path is matching or not
 * @dynamic
 * @hook {function}
 */
const usePath = (path: string) => {
  const location = useLocation();

  return path === location.pathname;
};

export default usePath;
