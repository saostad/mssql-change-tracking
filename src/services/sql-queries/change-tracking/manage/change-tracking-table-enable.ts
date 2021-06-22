/**
 * @param "@tableName"
 * @note When the TRACK_COLUMNS_UPDATED option is set to ON, the SQL Server Database Engine stores extra information about which columns were updated to the internal change tracking table. Column tracking can enable an application to synchronize only those columns that were updated. This can improve efficiency and performance. However, because maintaining column tracking information adds some extra storage overhead, this option is set to OFF by default.
 */
export const changeTrackingTableEnableQuery = `ALTER TABLE @tableName  
ENABLE CHANGE_TRACKING  
WITH (TRACK_COLUMNS_UPDATED = ON)`;
