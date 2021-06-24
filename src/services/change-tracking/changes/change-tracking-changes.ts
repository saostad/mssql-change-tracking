import sql from "mssql";

type CtChangesOutput = {
  SYS_CHANGE_VERSION: string;
  SYS_CHANGE_CREATION_VERSION: string;
  SYS_CHANGE_OPERATION: "I" | "U" | "D";
  SYS_CHANGE_COLUMNS: null | string;
  SYS_CHANGE_CONTEXT: null | string;
  // KeyID: "3690";
  // TODO add primary keys as part of result.
};

interface CtChanges extends QueryInput {
  pool: sql.ConnectionPool;
  sinceVersion: string;
  tableName: string;
}
/** @returns changes since specific version number */
export async function ctChanges({
  pool,
  sinceVersion,
  tableName,
  dbName,
  schema,
}: CtChanges) {
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
