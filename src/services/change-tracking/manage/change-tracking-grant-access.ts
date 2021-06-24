import sql from "mssql";

type CtGrantAccess = QueryInput & {
  pool: sql.ConnectionPool;
};

/** grant access to change tracking data for specific table to specific user */
export async function ctGrantAccess({
  pool,
  userName,
  tableName,
  dbName,
  schema,
}: CtGrantAccess): Promise<void> {
  await pool
    .request()
    .query(
      changeTrackingGrantAccessQuery({ tableName, userName, dbName, schema }),
    )
    .then((result) => result.recordset);
}

type QueryInput = {
  schema?: string;
  dbName?: string;
  tableName: string;
  userName: string;
};
function changeTrackingGrantAccessQuery({
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
