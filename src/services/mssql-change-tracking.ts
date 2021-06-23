import sql from "mssql";
import {
  changeTrackingChangesAllFieldsQuery,
  changeTrackingChangesQuery,
  changeTrackingCurrentVersionQuery,
  changeTrackingDbEnableQuery,
  changeTrackingDbStatusQuery,
  changeTrackingGrantAccessQuery,
  changeTrackingMinValidVersionByTableIdQuery,
  changeTrackingMinValidVersionByTableNameQuery,
} from "./sql-queries/change-tracking";

interface Base {
  pool: sql.ConnectionPool;
}

interface IGetDbStatus extends Base {
  dbName: string;
}
type GetDbStatusOut = {
  db_name: string;
  database_id: number;
  is_auto_cleanup_on: number;
  retention_period: number;
  retention_period_units: number;
  retention_period_units_desc: string;
  max_cleanup_version: null | string;
};
export async function getDbStatus({
  dbName,
  pool,
}: IGetDbStatus): Promise<GetDbStatusOut> {
  return pool
    .request()
    .query<GetDbStatusOut>(changeTrackingDbStatusQuery(dbName))
    .then((result) => result.recordset[0]);
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
export async function ctMinValidVersion(
  input: CtMinValidVersion,
): Promise<string | null> {
  //TODO type the return rows
  if (input.tableId) {
    return input.pool
      .request()
      .input("tableId", sql.Int, input.tableId)
      .query(changeTrackingMinValidVersionByTableIdQuery)
      .then((result) => result.recordset)
      .then((row) => row[0]["min_valid_version"]);
  } else {
    return input.pool
      .request()
      .input("tableName", sql.VarChar(30), input.tableName) // VARCHAR(30) is equivalent of sysname SOURCE: https://stackoverflow.com/questions/5720212/what-is-sysname-data-type-in-sql-server
      .query(changeTrackingMinValidVersionByTableNameQuery)
      .then((result) => result.recordset)
      .then((row) => row[0]["min_valid_version"]);
  }
}

interface CtChanges extends Base {
  sinceVersion: string;
  tableName: string;
}
/** @returns changes since specific version number */
export async function ctChanges({ pool, sinceVersion, tableName }: CtChanges) {
  // TODO return types!
  return pool
    .request()
    .input("version_number", sql.BigInt, sinceVersion)
    .query(changeTrackingChangesQuery(tableName))
    .then((result) => result.recordset);
}

interface ChangeTrackingChangesAllFields extends Base {
  sinceVersion: string;
  tableName: string;
  primaryKeys: string[];
}
/** @returns changes since specific version number */
export async function changeTrackingChangesAllFields({
  pool,
  sinceVersion,
  tableName,
  primaryKeys,
}: ChangeTrackingChangesAllFields) {
  // TODO return types!

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

interface CtGrantAccess extends Base {
  userName: string;
  tableName: string;
}
/** grant access to change tracking data for specific table to specific user */
export async function ctGrantAccess({
  pool,
  userName,
  tableName,
}: CtGrantAccess) {
  return pool
    .request()
    .query(changeTrackingGrantAccessQuery({ tableName, userName }))
    .then((result) => result.recordset);
}
