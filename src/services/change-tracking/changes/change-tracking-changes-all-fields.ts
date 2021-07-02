import sql from "mssql";
import { writeLog } from "fast-node-logger";
import { ctIsVersionValid, ctMinValidVersion } from "..";
import { getTableFullPath } from "../../../helpers/util";

type CtChangesAllFieldsInput = QueryInput & {
  pool: sql.ConnectionPool;
  /**
   * if set to true, will check the validity if version number before query for changes.
   * @default true
   * @description Before an application obtains changes by using CHANGETABLE(CHANGES ...), the application must validate the value for last_synchronization_version that it plans to pass to CHANGETABLE(CHANGES ...). If the value of last_synchronization_version is not valid, that application must reinitialize all the data. [Reference](https://docs.microsoft.com/en-us/sql/relational-databases/track-changes/work-with-change-tracking-sql-server?view=sql-server-ver15#validating-the-last-synchronized-version)
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

/**
 * @returns changes since specific version number including target table fields
 * @description This rowset function is used to query for change information. The function queries the data stored in the internal change tracking tables. The function returns a results set that contains the primary keys of rows that have changed together with other change information such as the operation, columns updated and version for the row.
 */
export async function ctChangesAllFields<TargetTableFields>({
  pool,
  sinceVersion,
  tableName,
  schema,
  dbName,
  primaryKeys,
  safeRun,
}: CtChangesAllFieldsInput): Promise<
  Array<CtChangesAllFieldsOutput & TargetTableFields>
> {
  writeLog(`ctChangesAllFields`, { level: "trace" });

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
          ctChangesAllFieldsQuery({
            tableName,
            sinceVersion,
            primaryKeys,
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
    return pool
      .request()
      .query(
        ctChangesAllFieldsQuery({
          tableName,
          sinceVersion,
          primaryKeys,
        }),
      )
      .then((result) => result.recordset);
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
