/**
 * @return list of change tracking enabled tables
 * @note
 * - Returns one row for each table in the current database that has change tracking enabled.
 * - Reference https://docs.microsoft.com/en-us/sql/relational-databases/system-catalog-views/change-tracking-catalog-views-sys-change-tracking-tables?view=sql-server-ver15
 */
export const changeTrackingTableStatusQuery = `SELECT OBJECT_NAME(object_id) AS table_name, * from sys.change_tracking_tables`;
