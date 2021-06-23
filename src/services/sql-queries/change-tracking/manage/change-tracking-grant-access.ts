type Input = {
  schema?: string;
  dbName?: string;
  tableName: string;
  userName: string;
};
export function changeTrackingGrantAccessQuery({
  tableName,
  userName,
  schema,
  dbName,
}: Input): string {
  let tableFullPath = `[${tableName}]`;
  if (dbName) {
    tableFullPath = `[${dbName}].[${tableName}]`;
  }
  if (schema && dbName) {
    tableFullPath = `[${schema}].[${dbName}].[${tableName}]`;
  }

  return `GRANT VIEW CHANGE TRACKING ON ${tableFullPath} TO ${userName}`;
}
