import { writeLog } from "fast-node-logger";
import sql from "mssql";

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
    .query(
      changeTrackingAccessGrantQuery({ tableName, userName, dbName, schema }),
    )
    .then((result) => result.recordset);
}

type QueryInput = {
  schema?: string;
  dbName?: string;
  tableName: string;
  userName: string;
};
function changeTrackingAccessGrantQuery({
  tableName,
  userName,
  schema,
  dbName,
}: QueryInput): string {
  let tableFullPath = `[${tableName}]`;
  if (dbName) {
    tableFullPath = `[${dbName}].[${tableName}]`;
  }
  if (schema && dbName) {
    tableFullPath = `[${dbName}].[${schema}].[${tableName}]`;
  }

  return `GRANT VIEW CHANGE TRACKING ON ${tableFullPath} TO [${userName}]`;
}
