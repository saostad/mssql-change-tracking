import { writeLog } from "fast-node-logger";
import sql from "mssql";

type CtIsVersionValid =
  | {
      pool: sql.ConnectionPool;
      versionNumber: string;
      dbName?: string;
      schema?: string;
      tableName?: string;
      tableId?: never;
    }
  | {
      pool: sql.ConnectionPool;
      versionNumber: string;
      dbName?: string;
      tableId?: number;
      schema?: never;
      tableName?: never;
    };

/**
 * @description This function is to check the validity of the value of versionNumber against specific table in the database.
 * @note
 * - this function accept table name or table ID
 * - If an application has a value for last_synchronization_version that is older than the minimum valid synchronization version for a table, that application cannot perform valid change enumeration. This is because some change information might have been cleaned up.
 */
export async function ctIsVersionValid(
  input: CtIsVersionValid,
): Promise<boolean> {
  writeLog(`ctIsVersionValid`, { level: "trace" });

  if (input.tableId) {
    return input.pool
      .request()
      .query(
        changeTrackingIsVersionValidByTableIdQuery({
          versionNumber: input.versionNumber,
          dbName: input.dbName,
          tableId: input.tableId,
        }),
      )
      .then((result) => result.recordset)
      .then((row) => row[0]["result"] !== "Client must be reinitialized");
  } else if (input.tableName) {
    return input.pool
      .request()
      .query(
        changeTrackingIsVersionValidByTableNameQuery({
          versionNumber: input.versionNumber,
          dbName: input.dbName,
          schema: input.schema,
          tableName: input.tableName,
        }),
      )
      .then((result) => result.recordset)
      .then((row) => row[0]["result"] !== "Client must be reinitialized");
  } else {
    throw new Error("tableName or tableId should be provided.");
  }
}

type TableIdQueryInput = {
  versionNumber: string;
  dbName?: string;
  tableId: number;
};
function changeTrackingIsVersionValidByTableIdQuery({
  versionNumber,
  dbName,
  tableId,
}: TableIdQueryInput): string {
  let query = `
  -- Check individual table.
   IF (${versionNumber} < CHANGE_TRACKING_MIN_VALID_VERSION(${tableId}))
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

type TableNameQueryInput = {
  versionNumber: string;
  dbName?: string;
  schema?: string;
  tableName: string;
};
function changeTrackingIsVersionValidByTableNameQuery({
  versionNumber,
  dbName,
  tableName,
  schema,
}: TableNameQueryInput): string {
  let tableFullPath = `[${tableName}]`;
  if (dbName) {
    tableFullPath = `[${dbName}].[${tableName}]`;
  }
  if (schema && dbName) {
    tableFullPath = `[${dbName}].[${schema}].[${tableName}]`;
  }

  let query = `
   -- Check individual table.  
   IF (${versionNumber} < CHANGE_TRACKING_MIN_VALID_VERSION(  
      OBJECT_ID('${tableFullPath}')))
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
