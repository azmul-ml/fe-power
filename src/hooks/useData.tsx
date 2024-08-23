/**
 * Hook for returning format data, meta and error from api response
 * @dynamic
 * @hook {function}
 */

export default function useData(props: any) {
  const { data, error } = props;
  const dataResponse = data?.data;
  const metaResponse = data?.data;
  const errorResponse: any = error?.response?.data?.error;
  return {
    data: dataResponse,
    meta: metaResponse,
    error: errorResponse,
  };
}
