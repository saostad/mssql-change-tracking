import { writeLog } from "fast-node-logger";
import sql from "mssql";
import { ctDbStatus } from "./change-tracking-db-status";

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
}: CtDbEnableInput): ReturnType<typeof ctDbStatus> {
  writeLog(`ctDbEnable`, { level: "trace" });

  await pool.request().query(
    changeTrackingDbEnableQuery({
      dbName,
      autoCleanup,
      retentionDayNumber,
      retentionPeriodUnit,
    }),
  );

  return ctDbStatus({ pool, dbName });
}

type QueryInput = {
  dbName: string;
  autoCleanup: boolean;
  retentionDayNumber: number;
  retentionPeriodUnit: RetentionPeriodUnit;
};
function changeTrackingDbEnableQuery({
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
