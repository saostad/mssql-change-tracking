import sql from "mssql";

interface Base {
  pool: sql.ConnectionPool;
}

// interface ChangeTrackingChangesAllFields extends Base {
//   sinceVersion: string;
//   tableName: string;
//   primaryKeys: string[];
// }
// /** @returns changes since specific version number */
// export async function changeTrackingChangesAllFields({
//   pool,
//   sinceVersion,
//   tableName,
//   primaryKeys,
// }: ChangeTrackingChangesAllFields) {
//   // TODO return types!

//   return pool
//     .request()
//     .query(
//       changeTrackingChangesAllFieldsQuery({
//         tableName,
//         sinceVersion,
//         primaryKeys,
//       }),
//     )
//     .then((result) => result.recordset);
// }

// interface CtGrantAccess extends Base {
//   userName: string;
//   tableName: string;
// }
// /** grant access to change tracking data for specific table to specific user */
// export async function ctGrantAccess({
//   pool,
//   userName,
//   tableName,
// }: CtGrantAccess) {
//   return pool
//     .request()
//     .query(changeTrackingGrantAccessQuery({ tableName, userName }))
//     .then((result) => result.recordset);
// }
