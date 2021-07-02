import { writeLog } from "fast-node-logger";
import sql from "mssql";
import { ctDbStatus } from "./change-tracking-db-status";

type CtDbDisable = {
  pool: sql.ConnectionPool;
  dbName: string;
};

/** Disable change tracking in DB level */
export async function ctDbDisable({
  dbName,
  pool,
}: CtDbDisable): ReturnType<typeof ctDbStatus> {
  writeLog(`ctDbDisable`, { level: "trace" });

  await pool.request().query(ctDbDisableQuery(dbName));
  return ctDbStatus({ pool, dbName });
}

export function ctDbDisableQuery(dbName: string): string {
  return `ALTER DATABASE [${dbName}] 
      SET CHANGE_TRACKING = OFF`;
}
