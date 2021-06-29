import { writeLog } from "fast-node-logger";
import sql from "mssql";

type CtIsVersionValid = QueryInput & { pool: sql.ConnectionPool };

/**
 * @description This function is to check the validity of the value of versionNumber against all tables in the database.
 * @note If an application has a value for last_synchronization_version that is older than the minimum valid synchronization version for a table, that application cannot perform valid change enumeration. This is because some change information might have been cleaned up.
 */
export async function ctIsVersionValidAllTables({
  pool,
  versionNumber,
}: CtIsVersionValid): Promise<boolean> {
  writeLog(`ctIsVersionValid`, { level: "trace" });

  return pool
    .request()
    .query(
      changeTrackingIsVersionValidAllTablesQuery({
        versionNumber,
      }),
    )
    .then((result) => result.recordset)
    .then((row) => row[0]["result"] !== "Client must be reinitialized");
}

type QueryInput = {
  versionNumber: string;
  dbName?: string;
};
function changeTrackingIsVersionValidAllTablesQuery({
  versionNumber,
  dbName,
}: QueryInput): string {
  let query = `
 -- Check all tables with change tracking enabled  
IF EXISTS (  
  SELECT 1 FROM sys.change_tracking_tables  
  WHERE min_valid_version > ${versionNumber} )  
BEGIN  
  -- Handle invalid version & do not enumerate changes  
  -- Client must be reinitialized  
  SELECT 'Client must be reinitialized' As result
END 
 `;

  if (dbName) {
    query = `USE [${dbName}]; `.concat(query);
  }
  return query;
}
