import { writeLog } from "fast-node-logger";
import sql from "mssql";
import { getTableFullPath } from "../../../helpers/util";

type CtGrantAccess = QueryInput & {
  pool: sql.ConnectionPool;
};

/** grant access to change tracking data for specific table to specific user */
export async function ctAccessGrant({
  pool,
  userName,
  tableName,
  dbName,
  schema,
}: CtGrantAccess): Promise<void> {
  writeLog(`ctAccessGrant`, { level: "trace" });

  await pool
    .request()
    .query(ctAccessGrantQuery({ tableName, userName, dbName, schema }))
    .then((result) => result.recordset);
}

type QueryInput = {
  schema?: string;
  dbName?: string;
  tableName: string;
  userName: string;
};
export function ctAccessGrantQuery({
  tableName,
  userName,
  schema,
  dbName,
}: QueryInput): string {
  const tableFullPath = getTableFullPath({ tableName, schema, dbName });

  let query = `GRANT VIEW CHANGE TRACKING ON ${tableFullPath} TO [${userName}]`;

  if (dbName) {
    query = `USE [${dbName}]; `.concat(query);
  }
  return query;
}
