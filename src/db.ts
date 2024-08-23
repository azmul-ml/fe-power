// db.ts
import Dexie, { type EntityTable } from "dexie";

interface CommonType {
  id: number;
}

const db = new Dexie("PowerBI") as Dexie & {
  dashboardData: EntityTable<any>; // primary key "id" (for the typings only)
};

// Schema declaration:
db.version(1).stores({
  dashboardData: "++id", // primary key "id" (for the runtime!)
});

export type { CommonType };
export { db };
