import sql from "mssql";
import {
  changeTrackingCurrentVersionQuery,
  changeTrackingDbEnableQuery,
  changeTrackingDbStatusQuery,
  changeTrackingMinValidVersionQueryByTableId,
  changeTrackingMinValidVersionQueryByTableName,
} from "./sql-queries/change-tracking";

interface Base {
  pool: sql.ConnectionPool;
}

interface IGetDbStatus extends Base {
  dbName: string;
}
export async function getDbStatus({ dbName, pool }: IGetDbStatus) {
  //TODO type the return rows
  return pool
    .request()
    .input("dbName", sql.NVarChar, dbName)
    .query(changeTrackingDbStatusQuery)
    .then((result) => result.recordset);
}

interface DbLevelOp extends Base {
  dbName: string;
  retentionDayNumber: number;
  /**
   * @description if true before try to enable th flag will check to make sure it's not on
   * @default true
   */
  safeRun?: boolean; // TODO: implement this flag
}

/** Enable change tracking in DB level
 * @return change tracking status
 */
export async function ctDbEnable({
  //TODO type the return rows
  pool,
  dbName,
  retentionDayNumber,
  safeRun,
}: DbLevelOp) {
  return pool
    .request()
    .input("dbName", sql.NVarChar, dbName)
    .input("retentionDayNumber", sql.Int, retentionDayNumber)
    .query(changeTrackingDbEnableQuery) // FIXME this is not working
    .then((result) => result.recordset);
}
/** Disable change tracking in DB level
 * @return change tracking status
 */
export async function ctDbDisable() {
  //TODO type the return rows
  // TODO
}
/** Enable change tracking in Table level
 * @return change tracking status
 */
export async function ctTableEnable() {
  //TODO type the return rows
  // TODO
}
/** Disable change tracking in Table level
 * @return change tracking status
 */
export async function ctTableDisable() {
  //TODO type the return rows
  // TODO
}

export async function ctCurrentVersion({ pool }: Base) {
  //TODO type the return rows
  return pool
    .request()
    .query(changeTrackingCurrentVersionQuery)
    .then((result) => result.recordset);
}

interface MinValidVersionByTableName extends Base {
  tableName: string;
  tableId?: never;
}
interface MinValidVersionByTableId extends Base {
  tableId: string;
  tableName?: never;
}
type CtMinValidVersion = MinValidVersionByTableName | MinValidVersionByTableId;

/** @note this function accept table name or table ID */
export async function ctMinValidVersion(input: CtMinValidVersion) {
  //TODO type the return rows
  if (input.tableId) {
    return input.pool
      .request()
      .input("tableId", sql.Int, input.tableId)
      .query(changeTrackingMinValidVersionQueryByTableId)
      .then((result) => result.recordset);
  } else {
    return input.pool
      .request()
      .input("tableName", sql.VarChar(30), input.tableName) // VARCHAR(30) is equivalent of sysname SOURCE: https://stackoverflow.com/questions/5720212/what-is-sysname-data-type-in-sql-server
      .query(changeTrackingMinValidVersionQueryByTableName)
      .then((result) => result.recordset);
  }
}
