import { writeLog } from "fast-node-logger";
import sql from "mssql";

interface Base {
  pool: sql.ConnectionPool;
}

interface IGetDbStatus extends Base {
  dbName: string;
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
export async function ctDbStatus({
  dbName,
  pool,
}: IGetDbStatus): Promise<GetDbStatusOut | undefined> {
  writeLog(`ctDbStatus`, { level: "trace" });

  return pool
    .request()
    .query<GetDbStatusOut>(ctDbStatusQuery(dbName))
    .then((result) => result.recordset[0]);
}

/**
 * @Reference https://docs.microsoft.com/en-us/sql/relational-databases/system-catalog-views/change-tracking-catalog-views-sys-change-tracking-databases?view=sql-server-ver15
 */
function ctDbStatusQuery(dbName: string): string {
  return `SELECT DB_NAME(database_id) AS db_name, *
  FROM sys.change_tracking_databases
  WHERE database_id = DB_ID('${dbName}')`;
}
