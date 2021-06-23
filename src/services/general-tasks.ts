import sql from "mssql";
import { primaryKeysQuery } from "./sql-queries/general/primary-keys";

interface Base {
  pool: sql.ConnectionPool;
}

interface GetPrimaryKeys extends Base {
  tableName: string;
}
export async function getPrimaryKeys({ pool, tableName }: GetPrimaryKeys) {
  return pool
    .request()
    .query(primaryKeysQuery(tableName))
    .then((result) => result.recordset)
    .then((rows) => rows.map((el) => el["Column_Name"]));
}
