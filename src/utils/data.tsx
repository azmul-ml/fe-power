export class UtilDataHelper {
  static parseData(obj: any) {
    function getNestedPaths(obj: any, parentPath = "") {
      let paths: string[] = [];

      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          const currentPath = parentPath ? `${parentPath}.${key}` : key;

          if (
            typeof obj[key] === "object" &&
            obj[key] !== null &&
            !Array.isArray(obj[key])
          ) {
            paths = paths.concat(getNestedPaths(obj[key], currentPath));
          } else {
            paths.push(currentPath);
          }
        }
      }

      return paths;
    }

    const paths = getNestedPaths(obj);

    function getMaxNestedPath(paths: string[]) {
      return paths.reduce((maxPath, currentPath) => {
        return currentPath.split(".").length > maxPath.split(".").length
          ? currentPath
          : maxPath;
      }, "");
    }

    const maxNestedPath = getMaxNestedPath(paths);

    function getNestedValue(obj: any, path: string) {
      return path
        .split(".")
        .reduce(
          (acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined),
          obj
        );
    }

    const value = getNestedValue(obj, maxNestedPath);
    return value;
  }
}
