import { writeLog } from "fast-node-logger";
import sql from "mssql";

type CtCurrentVersionInput = {
  pool: sql.ConnectionPool;
  dbName?: string;
};

/** @description this function is used to obtain the current version that will be used the next time when querying changes. This version represents the version of the last committed transaction. */
export async function ctCurrentVersion({
  pool,
  dbName,
}: CtCurrentVersionInput): Promise<string> {
  writeLog(`ctCurrentVersion`, { level: "trace" });

  return pool
    .request()
    .query(changeTrackingCurrentVersionQuery(dbName))
    .then((result) => result.recordset[0])
    .then((row) => row["current_version"]);
}

/**
 * @reference https://docs.microsoft.com/en-us/sql/relational-databases/track-changes/work-with-change-tracking-sql-server?view=sql-server-ver15#about-the-change-tracking-functions
 */
function changeTrackingCurrentVersionQuery(dbName?: string): string {
  let query = `SELECT CHANGE_TRACKING_CURRENT_VERSION() AS current_version`;

  if (dbName) {
    query = `USE [${dbName}]; `.concat(query);
  }

  return query;
}
