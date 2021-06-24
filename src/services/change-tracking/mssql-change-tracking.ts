import sql from "mssql";

interface Base {
  pool: sql.ConnectionPool;
}

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
