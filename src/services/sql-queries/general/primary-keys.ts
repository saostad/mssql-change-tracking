export function primaryKeysQuery(tableName: string) {
  return `SELECT Col.Column_Name from 
  INFORMATION_SCHEMA.TABLE_CONSTRAINTS Tab, 
  INFORMATION_SCHEMA.CONSTRAINT_COLUMN_USAGE Col 
  WHERE 
  Col.Constraint_Name = Tab.Constraint_Name
  AND Col.Table_Name = Tab.Table_Name
  AND Constraint_Type = 'PRIMARY KEY'
  AND Col.Table_Name = '${tableName}'`;
}
