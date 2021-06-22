/**
 * @param "@dbName"
 * @Reference https://docs.microsoft.com/en-us/sql/relational-databases/system-catalog-views/change-tracking-catalog-views-sys-change-tracking-databases?view=sql-server-ver15
 */
export const changeTrackingDbStatusQuery = `SELECT DB_NAME(database_id) AS db_name, *
FROM sys.change_tracking_databases
WHERE database_id = DB_ID(@dbName)`;
