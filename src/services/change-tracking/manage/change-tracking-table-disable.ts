import { writeLog } from "fast-node-logger";
import sql from "mssql";
import { ctTablesStatus } from "./change-tracking-table-status";
type CtTableDisableInput = QueryInput & {
  pool: sql.ConnectionPool;
};

/** Disable change tracking in Table level */
export async function ctTableDisable({
  tableName,
  dbName,
  schema,
  pool,
}: CtTableDisableInput): ReturnType<typeof ctTablesStatus> {
  writeLog(`ctTableDisable`, { level: "trace" });

  await pool
    .request()
    .query(changeTrackingTableDisableQuery({ schema, dbName, tableName }));

  return ctTablesStatus({ dbName, pool });
}

type QueryInput = {
  schema?: string;
  dbName?: string;
  tableName: string;
};
function changeTrackingTableDisableQuery({
  tableName,
  dbName,
  schema,
}: QueryInput): string {
  let tableFullPath = `[${tableName}]`;
  if (dbName) {
    tableFullPath = `[${dbName}].[${tableName}]`;
  }
  if (schema && dbName) {
    tableFullPath = `[${dbName}].[${schema}].[${tableName}]`;
  }

  return `ALTER TABLE ${tableFullPath} 
  DISABLE CHANGE_TRACKING;`;
}
