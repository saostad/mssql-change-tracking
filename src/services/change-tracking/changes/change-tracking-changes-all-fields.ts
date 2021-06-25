import sql from "mssql";
import { writeLog } from "fast-node-logger";

type CtChangesAllFieldsInput = QueryInput & {
  pool: sql.ConnectionPool;
};

type CtChangesAllFieldsOutput = {
  SYS_CHANGE_VERSION: string;
  SYS_CHANGE_CREATION_VERSION: string;
  SYS_CHANGE_OPERATION: "I" | "U" | "D";
  SYS_CHANGE_COLUMNS: null | string;
  SYS_CHANGE_CONTEXT: null | string;
  [targetTableFields: string]: any;
};

/** @returns changes since specific version number including target table fields */
export async function ctChangesAllFields<TargetTableFields>({
  pool,
  sinceVersion,
  tableName,
  primaryKeys,
}: CtChangesAllFieldsInput): Promise<
  Array<CtChangesAllFieldsOutput & TargetTableFields>
> {
  writeLog(`ctChangesAllFields`, { level: "trace" });
  return pool
    .request()
    .query(
      changeTrackingChangesAllFieldsQuery({
        tableName,
        sinceVersion,
        primaryKeys,
      }),
    )
    .then((result) => result.recordset);
}

type QueryInput = {
  schema?: string;
  dbName?: string;
  tableName: string;
  primaryKeys: string[];
  sinceVersion: string;
};
function changeTrackingChangesAllFieldsQuery({
  schema,
  dbName,
  tableName,
  primaryKeys,
  sinceVersion,
}: QueryInput): string {
  let tableFullPath = `[${tableName}]`;
  if (dbName) {
    tableFullPath = `[${dbName}].[${tableName}]`;
  }
  if (schema && dbName) {
    tableFullPath = `[${dbName}].[${schema}].[${tableName}]`;
  }

  let query = `SELECT *  
  FROM CHANGETABLE (CHANGES ${tableFullPath}, ${sinceVersion}) as ct
  LEFT JOIN ${tableFullPath} ON ct.[${primaryKeys[0]}] = ${tableFullPath}.[${primaryKeys[0]}]`;

  for (let i = 1; i < primaryKeys.length; i++) {
    query = query.concat(
      ` AND ct.[${primaryKeys[i]}] = ${tableFullPath}.[${primaryKeys[i]}]`,
    );
  }

  return query;
}
