import { writeLog } from "fast-node-logger";
import sql from "mssql";

type CtChangesOutput = {
  SYS_CHANGE_VERSION: string;
  SYS_CHANGE_CREATION_VERSION: string;
  SYS_CHANGE_OPERATION: "I" | "U" | "D";
  SYS_CHANGE_COLUMNS: null | string;
  SYS_CHANGE_CONTEXT: null | string;
  [primaryKey: string]: any;
};

interface CtChangesInput extends QueryInput {
  pool: sql.ConnectionPool;
  sinceVersion: string;
  tableName: string;
}
/**
 * @returns changes since specific version number
 * @description This rowset function is used to query for change information. The function queries the data stored in the internal change tracking tables. The function returns a results set that contains the primary keys of rows that have changed together with other change information such as the operation, columns updated and version for the row.
 */
export async function ctChanges<PrimaryKeys>({
  pool,
  sinceVersion,
  tableName,
  dbName,
  schema,
}: CtChangesInput): Promise<Array<CtChangesOutput & PrimaryKeys>> {
  writeLog(`ctChanges`, { level: "trace" });

  return pool
    .request()
    .query(
      changeTrackingChangesQuery({ schema, dbName, tableName, sinceVersion }),
    )
    .then((result) => result.recordset);
}

type QueryInput = {
  schema?: string;
  dbName?: string;
  tableName: string;
  sinceVersion: string;
};

/**
 * @Reference https://docs.microsoft.com/en-us/sql/relational-databases/system-functions/changetable-transact-sql?view=sql-server-ver15
 * @Permissions https://docs.microsoft.com/en-us/sql/relational-databases/track-changes/manage-change-tracking-sql-server?view=sql-server-ver15#security*/
function changeTrackingChangesQuery({
  sinceVersion,
  dbName,
  schema,
  tableName,
}: QueryInput): string {
  let tableFullPath = `[${tableName}]`;
  if (dbName) {
    tableFullPath = `[${dbName}].[${tableName}]`;
  }
  if (schema && dbName) {
    tableFullPath = `[${dbName}].[${schema}].[${tableName}]`;
  }

  return `SELECT * FROM CHANGETABLE (CHANGES ${tableFullPath}, ${sinceVersion}) AS ct`;
}
