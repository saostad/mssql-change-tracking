import { writeLog } from "fast-node-logger";
import sql from "mssql";
import { siStatus } from "./snapshot-isolation-status";

type SiDbDisable = {
  pool: sql.ConnectionPool;
  dbName: string;
};

/** Disable snapshot isolation on specific DB */
export async function siDbDisable({
  dbName,
  pool,
}: SiDbDisable): ReturnType<typeof siStatus> {
  writeLog(`siDbDisable`, { level: "trace" });

  await pool.request().query(siDbDisableQuery(dbName));
  return siStatus({ pool, dbName });
}

function siDbDisableQuery(dbName: string): string {
  return `ALTER DATABASE [${dbName}] 
    SET ALLOW_SNAPSHOT_ISOLATION OFF`;
}
