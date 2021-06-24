import sql from "mssql";

interface IGetDbStatus {
  pool: sql.ConnectionPool;
  /** if not provided it uses default pool database */
  dbName?: string;
}
type GetTablesStatusOut = {
  table_name: string;
  object_id: bigint;
  is_track_columns_updated_on: "0" | "1";
  min_valid_version: bigint;
  begin_version: bigint;
  cleanup_version: bigint;
};
export async function ctTablesStatus({
  pool,
  dbName,
}: IGetDbStatus): Promise<GetTablesStatusOut[]> {
  return pool
    .request()
    .query(changeTrackingTablesStatusQuery(dbName))
    .then((result) => result.recordset);
}

/**
 * @return sql query to get list of change tracking enabled tables
 * @note
 * - Returns one row for each table in the current database that has change tracking enabled.
 * - Reference https://docs.microsoft.com/en-us/sql/relational-databases/system-catalog-views/change-tracking-catalog-views-sys-change-tracking-tables?view=sql-server-ver15
 */
function changeTrackingTablesStatusQuery(dbName?: string): string {
  let query = `SELECT OBJECT_NAME(object_id) AS table_name, * FROM sys.change_tracking_tables`;

  if (dbName) {
    query = `USE [${dbName}]; `.concat(query);
  }
  return query;
}
