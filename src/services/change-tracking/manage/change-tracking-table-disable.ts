type Input = {
  schema?: string;
  dbName?: string;
  tableName: string;
};
export function changeTrackingTableDisableQuery({
  tableName,
  dbName,
  schema,
}: Input): string {
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
