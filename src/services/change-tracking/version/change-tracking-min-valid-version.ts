import { writeLog } from "fast-node-logger";
import sql from "mssql";
import { getTableFullPath } from "../../../helpers/util";

interface MinValidVersionByTableName {
  pool: sql.ConnectionPool;
  dbName?: string;
  schema?: string;
  tableName: string;
  tableId?: never;
}
interface MinValidVersionByTableId {
  pool: sql.ConnectionPool;
  tableId: string;
  dbName?: string;
  schema?: never;
  tableName?: never;
}
type CtMinValidVersion = MinValidVersionByTableName | MinValidVersionByTableId;

/**
 * @note this function accept table name or table ID
 * @description This function is used to obtain the minimum valid version that a client can have and still obtain valid results from CHANGETABLE(). The client should check the last synchronization version against the value that is returned by this function. If the last synchronization version is less than the version returned by this function, the client will be unable to obtain valid results from CHANGETABLE() and will have to reinitialize.
 */
export async function ctMinValidVersion(
  input: CtMinValidVersion,
): Promise<string | null> {
  writeLog(`ctMinValidVersion`, { level: "trace" });

  if (input.tableId) {
    return input.pool
      .request()
      .query(
        ctMinValidVersionByTableIdQuery({
          tableId: input.tableId,
          dbName: input.dbName,
        }),
      )
      .then((result) => result.recordset)
      .then((row) => row[0]["min_valid_version"]);
  } else if (input.tableName) {
    return input.pool
      .request()
      .query(
        ctMinValidVersionByTableNameQuery({
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

type TableNameQueryInput = {
  schema?: string;
  dbName?: string;
  tableName: string;
};
export function ctMinValidVersionByTableNameQuery({
  tableName,
  dbName,
  schema,
}: TableNameQueryInput): string {
  const tableFullPath = getTableFullPath({ tableName, schema, dbName });

  let query = `SELECT CHANGE_TRACKING_MIN_VALID_VERSION(OBJECT_ID('${tableFullPath}')) AS min_valid_version`;

  if (dbName) {
    query = `USE [${dbName}]; `.concat(query);
  }
  return query;
}

type TableIdQueryInput = {
  tableId: string;
  dbName?: string;
};
export function ctMinValidVersionByTableIdQuery({
  dbName,
  tableId,
}: TableIdQueryInput): string {
  let query = `SELECT CHANGE_TRACKING_MIN_VALID_VERSION(${tableId}) AS min_valid_version`;

  if (dbName) {
    query = `USE [${dbName}]; `.concat(query);
  }

  return query;
}
