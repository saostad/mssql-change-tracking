export function primaryKeysQuery(tableName: string): string {
  return `SELECT Col.Column_Name FROM 
  INFORMATION_SCHEMA.TABLE_CONSTRAINTS Tab, 
  INFORMATION_SCHEMA.CONSTRAINT_COLUMN_USAGE Col 
  WHERE 
  Col.Constraint_Name = Tab.Constraint_Name
  AND Col.Table_Name = Tab.Table_Name
  AND Constraint_Type = 'PRIMARY KEY'
  AND Col.Table_Name = '${tableName}'`;
}
