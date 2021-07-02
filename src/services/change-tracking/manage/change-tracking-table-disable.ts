import { writeLog } from "fast-node-logger";
import sql from "mssql";
import { getTableFullPath } from "../../../helpers/util";
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
    .query(ctTableDisableQuery({ schema, dbName, tableName }));

  return ctTablesStatus({ dbName, pool });
}

type QueryInput = {
  schema?: string;
  dbName?: string;
  tableName: string;
};
function ctTableDisableQuery({
  tableName,
  dbName,
  schema,
}: QueryInput): string {
  const tableFullPath = getTableFullPath({ tableName, schema, dbName });

  let query = `ALTER TABLE ${tableFullPath} 
  DISABLE CHANGE_TRACKING;`;

  if (dbName) {
    query = `USE [${dbName}]; `.concat(query);
  }
  return query;
}
