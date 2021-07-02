import sql from "mssql";
import { writeLog } from "fast-node-logger";
import { ctChangesSafeQuery, ctCurrentVersion } from "..";
import { getTableFullPath } from "../../../helpers/util";

type CtChangesAllFieldsInput = QueryInput & {
  pool: sql.ConnectionPool;
  /**
   * @default true
   * @behavior throws error if version is not valid
   * @description
   * - If set to true, will check the validity if version number before query for changes.
   * - Before an application obtains changes by using CHANGETABLE(CHANGES ...), the application must validate the value for last_synchronization_version that it plans to pass to CHANGETABLE(CHANGES ...). If the value of last_synchronization_version is not valid, that application must reinitialize all the data. [Reference](https://docs.microsoft.com/en-us/sql/relational-databases/track-changes/work-with-change-tracking-sql-server?view=sql-server-ver15#validating-the-last-synchronized-version)
   * @steps To obtain data inside a snapshot transaction, perform the following steps: ([Reference](https://docs.microsoft.com/en-us/sql/relational-databases/track-changes/work-with-change-tracking-sql-server?view=sql-server-ver15#using-snapshot-isolation))
   * 1. Set the transaction isolation level to snapshot and start a transaction.
   * 1. Validate the last synchronization version by using CHANGE_TRACKING_MIN_VALID_VERSION().
   * 1. Obtain the version to be used the next time by using CHANGE_TRACKING_CURRENT_VERSION().
   * 1. Obtain the changes for the table by using CHANGETABLE(CHANGES ...)
   * 1. Commit the transaction.
   */
  safeRun?: boolean;
};

type CtChangesAllFieldsOutput = {
  SYS_CHANGE_VERSION: string;
  SYS_CHANGE_CREATION_VERSION: string;
  SYS_CHANGE_OPERATION: "I" | "U" | "D";
  SYS_CHANGE_COLUMNS: null | string;
  SYS_CHANGE_CONTEXT: null | string;
  [targetTableFields: string]: any;
};

type ValidResult<TargetTableFields> = {
  currentVersion: string;
  changes: Array<CtChangesAllFieldsOutput & TargetTableFields>;
};

/**
 * @returns changes since specific version number including target table fields
 * @description This row-set function is used to query for change information. The function queries the data stored in the internal change tracking tables. The function returns a results set that contains the primary keys of rows that have changed together with other change information such as the operation, columns updated and version for the row.
 */
export async function ctChangesAllFields<TargetTableFields>({
  pool,
  sinceVersion,
  tableName,
  schema,
  dbName,
  primaryKeys,
  safeRun,
}: CtChangesAllFieldsInput): Promise<ValidResult<TargetTableFields>> {
  writeLog(`ctChangesAllFields`, { level: "trace" });

  // set default value for flag.
  let safeRunFlag = true;
  if (typeof safeRun === "boolean") {
    safeRunFlag = safeRun;
  }

  if (safeRunFlag) {
    const query = ctChangesSafeQuery({
      sinceVersion,
      tableName,
      dbName,
      schema,
      changeQuery: ctChangesAllFieldsQuery({
        sinceVersion,
        tableName,
        schema,
        primaryKeys,
      }),
    });

    return pool
      .request()
      .query(query)
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
    const currentVersion = await ctCurrentVersion({ pool, dbName });

    const changes = await pool
      .request()
      .query(
        ctChangesAllFieldsQuery({
          tableName,
          sinceVersion,
          primaryKeys,
        }),
      )
      .then((result) => result.recordset);

    return { currentVersion, changes };
  }
}

type QueryInput = {
  schema?: string;
  dbName?: string;
  tableName: string;
  primaryKeys: string[];
  sinceVersion: string;
};
export function ctChangesAllFieldsQuery({
  schema,
  dbName,
  tableName,
  primaryKeys,
  sinceVersion,
}: QueryInput): string {
  const tableFullPath = getTableFullPath({ tableName, schema, dbName });

  let query = `SELECT *  
  FROM CHANGETABLE (CHANGES ${tableFullPath}, ${sinceVersion}) as ct
  LEFT JOIN ${tableFullPath} ON ct.[${primaryKeys[0]}] = ${tableFullPath}.[${primaryKeys[0]}]`;

  for (let i = 1; i < primaryKeys.length; i++) {
    query = query.concat(
      ` AND ct.[${primaryKeys[i]}] = ${tableFullPath}.[${primaryKeys[i]}]`,
    );
  }

  if (dbName) {
    query = `USE [${dbName}]; `.concat(query);
  }
  return query;
}
