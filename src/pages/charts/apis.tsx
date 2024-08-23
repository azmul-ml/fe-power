import { api } from "@/api/apiHelper";
import { Endpoints } from "@/api/apiConst";

/**
 * Get Todos
 * @returns {Todos Response}
 */
export const getTodos = async (): Promise<any> =>
  await api.get(Endpoints.TODOS + "/todos");
