import sql from "mssql";
import { writeLog } from "fast-node-logger";

type SnapshotStatusOut = {
  db_name: string;
  is_read_committed_snapshot_on: "0" | "1";
  snapshot_isolation_state_desc: "OFF" | "ON";
};

type SnapshotStatusInput = {
  pool: sql.ConnectionPool;
  dbName?: string;
};
/** get snapshot isolation status on specific db */
export async function siStatus({
  pool,
  dbName,
}: SnapshotStatusInput): Promise<SnapshotStatusOut[]> {
  writeLog(`siStatus()`, { level: "trace" });

  return pool
    .request()
    .query(statusQuery(dbName))
    .then((result) => result.recordset);
}

function statusQuery(dbName?: string): string {
  let query = `
  SELECT DB_NAME(database_id) AS db_name, 
      is_read_committed_snapshot_on,
      snapshot_isolation_state_desc       
  FROM sys.databases
  WHERE database_id = DB_ID();`;

  if (dbName) {
    query = `USE ${dbName}; `.concat(query);
  }

  return query;
}
