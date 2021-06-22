/**
 * @param "@version_number"
 * @Reference https://docs.microsoft.com/en-us/sql/relational-databases/system-functions/changetable-transact-sql?view=sql-server-ver15
 * @Permissions https://docs.microsoft.com/en-us/sql/relational-databases/track-changes/manage-change-tracking-sql-server?view=sql-server-ver15#security*/
export function changeTrackingChangesQuery(tableName: string) {
  return `SELECT *  
  FROM CHANGETABLE (CHANGES ${tableName}, @version_number) AS c`;
}
