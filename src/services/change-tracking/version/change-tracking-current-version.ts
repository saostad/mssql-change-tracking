import sql from "mssql";

type CtCurrentVersionInput = {
  pool: sql.ConnectionPool;
  dbName?: string;
};

export async function ctCurrentVersion({
  pool,
  dbName,
}: CtCurrentVersionInput): Promise<string> {
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
