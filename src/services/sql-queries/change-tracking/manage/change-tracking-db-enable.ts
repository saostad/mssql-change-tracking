type Input = {
  dbName: string;
  retentionDayNumber: number;
};
export function changeTrackingDbEnableQuery({
  dbName,
  retentionDayNumber,
}: Input): string {
  return `ALTER DATABASE [${dbName}]
SET CHANGE_TRACKING = ON  
(CHANGE_RETENTION = ${retentionDayNumber} DAYS, AUTO_CLEANUP = ON)`;
}
