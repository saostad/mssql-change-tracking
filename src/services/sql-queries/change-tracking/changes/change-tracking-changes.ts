type Input = {
  schema?: string;
  dbName?: string;
  tableName: string;
  sinceVersion: string;
};

/**
 * @Reference https://docs.microsoft.com/en-us/sql/relational-databases/system-functions/changetable-transact-sql?view=sql-server-ver15
 * @Permissions https://docs.microsoft.com/en-us/sql/relational-databases/track-changes/manage-change-tracking-sql-server?view=sql-server-ver15#security*/
export function changeTrackingChangesQuery({
  sinceVersion,
  dbName,
  schema,
  tableName,
}: Input): string {
  let tableFullPath = `[${tableName}]`;
  if (dbName) {
    tableFullPath = `[${dbName}].[${tableName}]`;
  }
  if (schema && dbName) {
    tableFullPath = `[${schema}].[${dbName}].[${tableName}]`;
  }

  return `SELECT * FROM CHANGETABLE (CHANGES ${tableFullPath}, '${sinceVersion}') AS ct`;
}
