type Input = {
  schema?: string;
  dbName: string;
  retentionDayNumber: number;
};
export function changeTrackingDbEnableQuery({
  schema,
  dbName,
  retentionDayNumber,
}: Input): string {
  let dbFullPath = `[${dbName}]`;
  if (schema) {
    dbFullPath = `[${schema}].[${dbName}]`;
  }

  return `ALTER DATABASE ${dbFullPath}
SET CHANGE_TRACKING = ON  
(CHANGE_RETENTION = ${retentionDayNumber} DAYS, AUTO_CLEANUP = ON)`;
}
