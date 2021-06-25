import { writeLog } from "fast-node-logger";
import sql from "mssql";
import { ctTablesStatus } from "./change-tracking-table-status";

type CtTableEnableInput = QueryInput & {
  pool: sql.ConnectionPool;
};

/** Enable change tracking in Table level */
export async function ctTableEnable({
  pool,
  tableName,
  dbName,
  schema,
  trackColumnsUpdated,
}: CtTableEnableInput): ReturnType<typeof ctTablesStatus> {
  writeLog(`ctTableEnable`, { level: "trace" });

  await pool.request().query(
    changeTrackingTableEnableQuery({
      trackColumnsUpdated,
      schema,
      dbName,
      tableName,
    }),
  );

  return ctTablesStatus({ dbName, pool });
}

type QueryInput = {
  schema?: string;
  dbName?: string;
  tableName: string;
  /**
   * @note When the TRACK_COLUMNS_UPDATED option is set to ON, the SQL Server Database Engine stores extra information about which columns were updated to the internal change tracking table. Column tracking can enable an application to synchronize only those columns that were updated. This can improve efficiency and performance. However, because maintaining column tracking information adds some extra storage overhead, this option is set to OFF by default.
   */
  trackColumnsUpdated?: "ON" | "OFF";
};

function changeTrackingTableEnableQuery({
  schema,
  dbName,
  tableName,
  trackColumnsUpdated,
}: QueryInput): string {
  let tableFullPath = `[${tableName}]`;
  if (dbName) {
    tableFullPath = `[${dbName}].[${tableName}]`;
  }
  if (schema && dbName) {
    tableFullPath = `[${dbName}].[${schema}].[${tableName}]`;
  }

  let query = `ALTER TABLE ${tableFullPath}  
  ENABLE CHANGE_TRACKING`;

  if (trackColumnsUpdated) {
    query = query.concat(
      `WITH (TRACK_COLUMNS_UPDATED = ${trackColumnsUpdated})`,
    );
  }

  return query;
}
