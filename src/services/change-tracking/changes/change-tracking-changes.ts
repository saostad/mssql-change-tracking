import { writeLog } from "fast-node-logger";
import sql from "mssql";
import { ctIsVersionValid } from "../version/change-tracking-is-version-valid";
import { ctMinValidVersion } from "../version/change-tracking-min-valid-version";

type CtChangesOutput = {
  SYS_CHANGE_VERSION: string;
  SYS_CHANGE_CREATION_VERSION: string;
  SYS_CHANGE_OPERATION: "I" | "U" | "D";
  SYS_CHANGE_COLUMNS: null | string;
  SYS_CHANGE_CONTEXT: null | string;
  [primaryKey: string]: any;
};

interface CtChangesInput extends QueryInput {
  pool: sql.ConnectionPool;
  sinceVersion: string;
  tableName: string;
  /**
   * if set to true, will check the validity if version number before query for changes.
   * @default true
   * @description Before an application obtains changes by using CHANGETABLE(CHANGES ...), the application must validate the value for last_synchronization_version that it plans to pass to CHANGETABLE(CHANGES ...). If the value of last_synchronization_version is not valid, that application must reinitialize all the data. [Reference](https://docs.microsoft.com/en-us/sql/relational-databases/track-changes/work-with-change-tracking-sql-server?view=sql-server-ver15#validating-the-last-synchronized-version)
   */
  safeRun?: boolean;
}
/**
 * @returns changes since specific version number
 * @description This rowset function is used to query for change information. The function queries the data stored in the internal change tracking tables. The function returns a results set that contains the primary keys of rows that have changed together with other change information such as the operation, columns updated and version for the row.
 */
export async function ctChanges<PrimaryKeys>({
  pool,
  sinceVersion,
  tableName,
  dbName,
  schema,
  safeRun,
}: CtChangesInput): Promise<Array<CtChangesOutput & PrimaryKeys>> {
  writeLog(`ctChanges`, { level: "trace" });

  // set default value for flag.
  let safeRunFlag = true;
  if (safeRun) {
    safeRunFlag = safeRun;
  }

  if (safeRunFlag) {
    const isVersionValid = await ctIsVersionValid({
      pool,
      versionNumber: sinceVersion,
      schema,
      dbName,
      tableName,
    });
    if (isVersionValid) {
      return pool
        .request()
        .query(
          changeTrackingChangesQuery({
            schema,
            dbName,
            tableName,
            sinceVersion,
          }),
        )
        .then((result) => result.recordset);
    }

    // throw error because version is not valid!
    const minValidVersion = await ctMinValidVersion({
      pool,
      dbName,
      schema,
      tableName,
    });
    throw new Error(
      `version ${sinceVersion} is not valid. minimum valid version number is ${minValidVersion}`,
    );
  } else {
    // do not check for version validity
    return pool
      .request()
      .query(
        changeTrackingChangesQuery({ schema, dbName, tableName, sinceVersion }),
      )
      .then((result) => result.recordset);
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
function changeTrackingChangesQuery({
  sinceVersion,
  dbName,
  schema,
  tableName,
}: QueryInput): string {
  let tableFullPath = `[${tableName}]`;
  if (dbName) {
    tableFullPath = `[${dbName}].[${tableName}]`;
  }
  if (schema && dbName) {
    tableFullPath = `[${dbName}].[${schema}].[${tableName}]`;
  }

  return `SELECT * FROM CHANGETABLE (CHANGES ${tableFullPath}, ${sinceVersion}) AS ct`;
}
