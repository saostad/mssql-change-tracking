import sql from "mssql";

type CtTableDisableInput = QueryInput & {
  pool: sql.ConnectionPool;
};

/** Disable change tracking in Table level */
export async function ctTableDisable({
  tableName,
  dbName,
  schema,
  pool,
}: CtTableDisableInput): Promise<void> {
  await pool
    .request()
    .query(changeTrackingTableDisableQuery({ schema, dbName, tableName }));
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
