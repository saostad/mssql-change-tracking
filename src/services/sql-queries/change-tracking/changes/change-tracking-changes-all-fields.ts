type Input = {
  schema?: string;
  dbName?: string;
  tableName: string;
  primaryKeys: string[];
  sinceVersion: string;
};
export function changeTrackingChangesAllFieldsQuery({
  schema,
  dbName,
  tableName,
  primaryKeys,
  sinceVersion,
}: Input): string {
  let tableFullPath = `[${tableName}]`;
  if (dbName) {
    tableFullPath = `[${dbName}].[${tableName}]`;
  }
  if (schema && dbName) {
    tableFullPath = `[${schema}].[${dbName}].[${tableName}]`;
  }

  let query = `SELECT *  
  FROM CHANGETABLE (CHANGES ${tableFullPath}, ${sinceVersion}) as ct
  LEFT JOIN ${tableFullPath} ON ct.[${primaryKeys[0]}] = ${tableFullPath}.[${primaryKeys[0]}]`;

  for (let i = 1; i < primaryKeys.length; i++) {
    query = query.concat(
      ` AND ct.[${primaryKeys[i]}] = ${tableFullPath}.[${primaryKeys[i]}]`,
    );
  }

  return query;
}
