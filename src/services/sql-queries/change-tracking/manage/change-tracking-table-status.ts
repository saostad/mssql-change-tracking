/**
 * @return sql query to get list of change tracking enabled tables
 * @note
 * - Returns one row for each table in the current database that has change tracking enabled.
 * - Reference https://docs.microsoft.com/en-us/sql/relational-databases/system-catalog-views/change-tracking-catalog-views-sys-change-tracking-tables?view=sql-server-ver15
 */
export function changeTrackingTableStatusQuery(): string {
  return `SELECT OBJECT_NAME(object_id) AS table_name, * FROM sys.change_tracking_tables`;
}
