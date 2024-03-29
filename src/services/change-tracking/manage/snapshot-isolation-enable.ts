import { writeLog } from "fast-node-logger";
import sql from "mssql";
import { siStatus } from "./snapshot-isolation-status";

type SiDbEnable = {
  pool: sql.ConnectionPool;
  dbName: string;
};

/** Enable snapshot isolation on specific DB */
export async function siDbEnable({
  dbName,
  pool,
}: SiDbEnable): ReturnType<typeof siStatus> {
  writeLog(`siDbEnable`, { level: "trace" });

  await pool.request().query(siDbEnableQuery(dbName));
  return siStatus({ pool, dbName });
}

export function siDbEnableQuery(dbName: string): string {
  return `ALTER DATABASE [${dbName}] 
    SET ALLOW_SNAPSHOT_ISOLATION ON`;
}
