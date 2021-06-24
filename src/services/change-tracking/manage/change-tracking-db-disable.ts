export function changeTrackingDbDisableQuery(dbName: string): string {
  return `ALTER DATABASE [${dbName}] 
      SET CHANGE_TRACKING = OFF`;
}
