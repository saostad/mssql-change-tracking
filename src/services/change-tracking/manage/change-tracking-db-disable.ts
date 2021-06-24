import sql from "mssql";

type CtDbDisable = {
  pool: sql.ConnectionPool;
  dbName: string;
};

/** Disable change tracking in DB level */
export async function ctDbDisable({
  dbName,
  pool,
}: CtDbDisable): Promise<void> {
  await pool.request().query(changeTrackingDbDisableQuery(dbName));
}

function changeTrackingDbDisableQuery(dbName: string): string {
  return `ALTER DATABASE [${dbName}] 
      SET CHANGE_TRACKING = OFF`;
}
