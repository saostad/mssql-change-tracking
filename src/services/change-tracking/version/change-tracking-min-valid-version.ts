import sql from "mssql";

interface Base {
  pool: sql.ConnectionPool;
}

interface MinValidVersionByTableName extends Base {
  dbName?: string;
  schema?: string;
  tableName: string;
  tableId?: never;
}
interface MinValidVersionByTableId extends Base {
  tableId: string;
  dbName?: never;
  schema?: never;
  tableName?: never;
}
type CtMinValidVersion = MinValidVersionByTableName | MinValidVersionByTableId;

/** @note this function accept table name or table ID */
export async function ctMinValidVersion(
  input: CtMinValidVersion,
): Promise<string | null> {
  if (input.tableId) {
    return input.pool
      .request()
      .query(changeTrackingMinValidVersionByTableIdQuery(input.tableId))
      .then((result) => result.recordset)
      .then((row) => row[0]["min_valid_version"]);
  } else if (input.tableName) {
    return input.pool
      .request()
      .query(
        changeTrackingMinValidVersionByTableNameQuery({
          tableName: input.tableName,
          dbName: input.dbName,
          schema: input.schema,
        }),
      )
      .then((result) => result.recordset)
      .then((row) => row[0]["min_valid_version"]);
  } else {
    throw new Error("tableName or tableId should be provided.");
  }
}

type QueryInput = {
  schema?: string;
  dbName?: string;
  tableName: string;
};
function changeTrackingMinValidVersionByTableNameQuery({
  tableName,
  dbName,
  schema,
}: QueryInput): string {
  let tableFullPath = `[${tableName}]`;
  if (dbName) {
    tableFullPath = `[${dbName}].[${tableName}]`;
  }
  if (schema && dbName) {
    tableFullPath = `[${dbName}].[${schema}].[${tableName}]`;
  }

  return `SELECT CHANGE_TRACKING_MIN_VALID_VERSION(OBJECT_ID('${tableFullPath}')) AS min_valid_version`;
}

export function changeTrackingMinValidVersionByTableIdQuery(
  tableId: string,
): string {
  return `SELECT CHANGE_TRACKING_MIN_VALID_VERSION(${tableId}) AS min_valid_version`;
}
