import sql from "mssql";

/**
 * @Reference https://docs.microsoft.com/en-us/sql/relational-databases/system-catalog-views/change-tracking-catalog-views-sys-change-tracking-databases?view=sql-server-ver15
 */
export function changeTrackingDbStatusQuery(dbName: string): string {
  return `SELECT DB_NAME(database_id) AS db_name, *
  FROM sys.change_tracking_databases
  WHERE database_id = DB_ID('${dbName}')`;
}

interface IGetDbStatus {
  dbName: string;
  pool: sql.ConnectionPool;
}
type GetDbStatusOut = {
  db_name: string;
  database_id: number;
  is_auto_cleanup_on: number;
  retention_period: number;
  retention_period_units: number;
  retention_period_units_desc: string;
  max_cleanup_version: null | string;
};
export async function getDbStatus({
  dbName,
  pool,
}: IGetDbStatus): Promise<GetDbStatusOut> {
  return pool
    .request()
    .query<GetDbStatusOut>(changeTrackingDbStatusQuery(dbName))
    .then((result) => result.recordset[0]);
}
