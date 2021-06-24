import sql from "mssql";

type RetentionPeriodUnit = "MINUTES" | "HOURS" | "DAYS";

interface CtDbEnableInput {
  pool: sql.ConnectionPool;
  dbName: string;
  autoCleanup: boolean;
  retentionDayNumber: number;
  retentionPeriodUnit: RetentionPeriodUnit;
}

/** Enable change tracking in DB level */
export async function ctDbEnable({
  pool,
  dbName,
  autoCleanup,
  retentionDayNumber,
  retentionPeriodUnit,
}: CtDbEnableInput): Promise<void> {
  await pool
    .request()
    .query(
      changeTrackingDbEnableQuery({
        dbName,
        autoCleanup,
        retentionDayNumber,
        retentionPeriodUnit,
      }),
    )
    .then((result) => result.recordset);
}

type QueryInput = {
  dbName: string;
  autoCleanup: boolean;
  retentionDayNumber: number;
  retentionPeriodUnit: RetentionPeriodUnit;
};
export function changeTrackingDbEnableQuery({
  dbName,
  autoCleanup,
  retentionDayNumber,
  retentionPeriodUnit,
}: QueryInput): string {
  return `ALTER DATABASE [${dbName}]
SET CHANGE_TRACKING = ON  
(CHANGE_RETENTION = ${retentionDayNumber} ${retentionPeriodUnit}, AUTO_CLEANUP = ${
    autoCleanup ? "ON" : "OFF"
  })`;
}
