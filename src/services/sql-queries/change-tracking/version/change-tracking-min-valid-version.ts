type Input = {
  schema?: string;
  dbName?: string;
  tableName: string;
};
export function changeTrackingMinValidVersionByTableNameQuery({
  tableName,
  dbName,
  schema,
}: Input): string {
  let tableFullPath = `[${tableName}]`;
  if (dbName) {
    tableFullPath = `[${dbName}].[${tableName}]`;
  }
  if (schema && dbName) {
    tableFullPath = `[${schema}].[${dbName}].[${tableName}]`;
  }

  return `SELECT CHANGE_TRACKING_MIN_VALID_VERSION(OBJECT_ID(${tableFullPath})) AS min_valid_version`;
}

export function changeTrackingMinValidVersionByTableIdQuery(
  tableId: string,
): string {
  return `SELECT CHANGE_TRACKING_MIN_VALID_VERSION(${tableId}) AS min_valid_version`;
}
