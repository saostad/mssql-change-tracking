import { writeLog } from "fast-node-logger";
import sql from "mssql";
import { ctCurrentVersionQuery } from "..";
import { getTableFullPath } from "../../../helpers/util";
import { ctCurrentVersion } from "../version/change-tracking-current-version";

type CtChangesOutput = {
  SYS_CHANGE_VERSION: string;
  SYS_CHANGE_CREATION_VERSION: string;
  SYS_CHANGE_OPERATION: "I" | "U" | "D";
  SYS_CHANGE_COLUMNS: null | string;
  SYS_CHANGE_CONTEXT: null | string;
  [primaryKey: string]: any;
};

type ValidResult<PrimaryKeys> = {
  currentVersion: string;
  changes: Array<CtChangesOutput & PrimaryKeys>;
};

interface CtChangesInput extends QueryInput {
  pool: sql.ConnectionPool;
  sinceVersion: string;
  tableName: string;
  /**
   * @default true
   * @behavior throws error if version is not valid
   * @description
   * - If set to true, will check the validity if version number before query for changes and uses [Snapshot Isolation](https://docs.microsoft.com/en-us/sql/relational-databases/track-changes/work-with-change-tracking-sql-server?view=sql-server-ver15#using-snapshot-isolation).
   * - Before an application obtains changes by using CHANGETABLE(CHANGES ...), the application must validate the value for last_synchronization_version that it plans to pass to CHANGETABLE(CHANGES ...). If the value of last_synchronization_version is not valid, that application must reinitialize all the data. [Reference](https://docs.microsoft.com/en-us/sql/relational-databases/track-changes/work-with-change-tracking-sql-server?view=sql-server-ver15#validating-the-last-synchronized-version)
   * @steps To obtain data inside a snapshot transaction, perform the following steps: ([Reference](https://docs.microsoft.com/en-us/sql/relational-databases/track-changes/work-with-change-tracking-sql-server?view=sql-server-ver15#using-snapshot-isolation))
   * 1. Set the transaction isolation level to snapshot and start a transaction.
   * 1. Validate the last synchronization version by using CHANGE_TRACKING_MIN_VALID_VERSION().
   * 1. Obtain the version to be used the next time by using CHANGE_TRACKING_CURRENT_VERSION().
   * 1. Obtain the changes for the table by using CHANGETABLE(CHANGES ...)
   * 1. Commit the transaction.
   */
  safeRun?: boolean;
}
/**
 * @returns changes since specific version number
 * @description This row-set function is used to query for change information. The function queries the data stored in the internal change tracking tables. The function returns a results set that contains the primary keys of rows that have changed together with other change information such as the operation, columns updated and version for the row.
 */
export async function ctChanges<PrimaryKeys>({
  pool,
  sinceVersion,
  tableName,
  dbName,
  schema,
  safeRun,
}: CtChangesInput): Promise<ValidResult<PrimaryKeys>> {
  writeLog(`ctChanges()`, { level: "trace" });

  // set default value for flag.
  let safeRunFlag = true;
  if (typeof safeRun === "boolean") {
    safeRunFlag = safeRun;
  }

  if (safeRunFlag) {
    return pool
      .request()
      .query(ctChangesSafeQuery({ schema, dbName, tableName, sinceVersion }))
      .then((result) => {
        if (result.recordset[0].error) {
          throw new Error(result.recordset[0].error);
        }
        return {
          currentVersion: result.recordsets[0][0]["current_version"],
          changes: result.recordsets[1],
        };
      });
  } else {
    // do not check for version validity and snapshot isolation
    console.log(`File: change-tracking-changes.ts,`, `Line: 75 => `);

    const currentVersion = await ctCurrentVersion({ pool, dbName });

    const changes = await pool
      .request()
      .query(ctChangesQuery({ schema, dbName, tableName, sinceVersion }))
      .then((result) => result.recordset);

    return { changes, currentVersion };
  }
}

type QueryInput = {
  schema?: string;
  dbName?: string;
  tableName: string;
  sinceVersion: string;
};

/**
 * @reference https://docs.microsoft.com/en-us/sql/relational-databases/system-functions/changetable-transact-sql?view=sql-server-ver15
 * @note [required permissions](https://docs.microsoft.com/en-us/sql/relational-databases/track-changes/manage-change-tracking-sql-server?view=sql-server-ver15#security)
 */
function ctChangesQuery({
  sinceVersion,
  dbName,
  schema,
  tableName,
}: QueryInput): string {
  writeLog(`ctChangesQuery()`, { level: "trace" });
  const tableFullPath = getTableFullPath({ tableName, schema, dbName });

  let query = `SELECT * FROM CHANGETABLE (CHANGES ${tableFullPath}, ${sinceVersion}) AS ct`;
  if (dbName) {
    query = `USE [${dbName}]; `.concat(query);
  }
  return query;
}

/**
 * @steps To obtain data inside a snapshot transaction, perform the following steps: ([Reference](https://docs.microsoft.com/en-us/sql/relational-databases/track-changes/work-with-change-tracking-sql-server?view=sql-server-ver15#using-snapshot-isolation))
 * 1. Set the transaction isolation level to snapshot and start a transaction.
 * 1. Validate the last synchronization version by using CHANGE_TRACKING_MIN_VALID_VERSION().
 * 1. Obtain the version to be used the next time by using CHANGE_TRACKING_CURRENT_VERSION().
 * 1. Obtain the changes for the table by using CHANGETABLE(CHANGES ...)
 * 1. Commit the transaction.
 */
function ctChangesSafeQuery({
  tableName,
  sinceVersion,
  schema,
  dbName,
}: QueryInput): string {
  writeLog(`ctChangesSafeQuery()`, { level: "trace" });

  let tableFullPath = `[${tableName}]`;

  if (schema && dbName) {
    tableFullPath = `[${dbName}].[${schema}].[${tableName}]`;
  }
  if (schema && !dbName) {
    tableFullPath = `[${schema}].[${tableName}]`;
  }

  let query = `
  SET TRANSACTION ISOLATION LEVEL SNAPSHOT;  
  BEGIN TRAN  
      -- Verify that version of the previous synchronization is valid.  
      IF (${sinceVersion} >= CHANGE_TRACKING_MIN_VALID_VERSION(  
          OBJECT_ID('${tableFullPath}')))
          BEGIN  
               -- Obtain the version to use next time.  
              ${ctCurrentVersionQuery()}
              -- Obtain changes.
              ${ctChangesQuery({ sinceVersion, tableName, schema })}  
          END 
      ELSE
          BEGIN
              -- Handle invalid version & do not enumerate changes  
              -- Client must be reinitialized  
              SELECT 'Version number ${sinceVersion} is not valid. Client must be reinitialized' As error
          END
  COMMIT TRAN`;

  if (dbName) {
    query = `USE [${dbName}]; `.concat(query);
  }
  return query;
}
