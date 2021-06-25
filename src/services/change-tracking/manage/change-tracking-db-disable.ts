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

  await pool.request().query(changeTrackingDbDisableQuery(dbName));
  return ctDbStatus({ pool, dbName });
}

function changeTrackingDbDisableQuery(dbName: string): string {
  return `ALTER DATABASE [${dbName}] 
      SET CHANGE_TRACKING = OFF`;
}
