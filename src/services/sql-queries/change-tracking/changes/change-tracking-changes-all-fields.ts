type ChangeTrackingAllFieldsQuery = {
  tableName: string;
  primaryKeys: string[];
  sinceVersion: string;
};
export function changeTrackingChangesAllFieldsQuery({
  tableName,
  primaryKeys,
  sinceVersion,
}: ChangeTrackingAllFieldsQuery) {
  let query = `SELECT *  
  FROM CHANGETABLE (CHANGES [${tableName}], ${sinceVersion}) as ct
  LEFT JOIN [${tableName}] ON ct.[${primaryKeys[0]}] = [${tableName}].[${primaryKeys[0]}]`;

  for (let i = 1; i < primaryKeys.length; i++) {
    query = query.concat(
      ` AND ct.[${primaryKeys[i]}] = [${tableName}].[${primaryKeys[i]}]`,
    );
  }

  return query;
}
