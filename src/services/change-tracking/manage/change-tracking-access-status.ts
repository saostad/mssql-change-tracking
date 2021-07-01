import { writeLog } from "fast-node-logger";
import sql from "mssql";

type AccessStatusInput = QueryInput & {
  pool: sql.ConnectionPool;
};

type AccessStatusOut = {
  principal_id: number;
  UserName: string;
  User_or_Role:
    | "APPLICATION_ROLE"
    | "CERTIFICATE_MAP"
    | "PED_USER"
    | "EXTERNAL_USER"
    | "WINDOWS_GROUP"
    | "ASYMMETRIC_KEY_"
    | "MAPPED_USER"
    | "DATABASE_ROLE"
    | "SQL_USER"
    | "WINDOWS_USER"
    | "EXTERNAL_GROUPS";
  Auth_Type:
    | "NONE" // No authentication
    | "INSTANCE" // Instance authentication
    | "DATABASE" // Database authentication
    | "WINDOWS" // Windows authentication
    | "EXTERNAL"; // Azure Active Directory authentication
  state_desc: "DENY" | "REVOKE" | "GRANT" | "GRANT_WITH_GRANT_OPTION";
  /** Permission name - nvarchar(128) */
  permission_name: string;
  class_desc:
    | "DATABASE"
    | "OBJECT_OR_COLUMN"
    | "SCHEMA"
    | "DATABASE_PRINCIPAL"
    | "ASSEMBLY"
    | "TYPE"
    | "XML_SCHEMA_COLLECTION"
    | "MESSAGE_TYPE"
    | "SERVICE_CONTRACT"
    | "SERVICE"
    | "REMOTE_SERVICE_BINDING"
    | "ROUTE"
    | "FULLTEXT_CATALOG"
    | "SYMMETRIC_KEYS"
    | "CERTIFICATE"
    | "ASYMMETRIC_KEY"
    | "FULLTEXT STOPLIST"
    | "SEARCH PROPERTY LIST"
    | "DATABASE SCOPED CREDENTIAL"
    | "EXTERNAL LANGUAGE";
  Object: string | null;
  create_date: Date;
  modify_date: Date;
};

/** @returns list of permissions to specific user */
export async function ctAccessStatus({
  pool,
  dbName,
  userName,
}: AccessStatusInput): Promise<AccessStatusOut[]> {
  writeLog(`ctAccessStatus`, { level: "trace" });

  return pool
    .request()
    .query(changeTrackingAccessStatusQuery({ userName, dbName }))
    .then((result) => result.recordset);
}

type QueryInput = {
  /** if not provided it uses default pool database */
  dbName?: string;
  /** name of user or role */
  userName: string;
};
/**
 * @return sql query to get list of change tracking enabled tables
 */
function changeTrackingAccessStatusQuery({
  dbName,
  userName,
}: QueryInput): string {
  let query = `SELECT DISTINCT pr.principal_id, pr.name AS [UserName], pr.type_desc AS [User_or_Role], 
  pr.authentication_type_desc AS [Auth_Type], pe.state_desc,
  pe.permission_name, pe.class_desc, o.[name] AS 'Object', pr.create_date, pr.modify_date
  FROM sys.database_principals AS pr 
  JOIN sys.database_permissions AS pe ON pe.grantee_principal_id = pr.principal_id
  LEFT JOIN sys.objects AS o on (o.object_id = pe.major_id)
  WHERE pr.name = '${userName}'`;

  if (dbName) {
    query = `USE [${dbName}]; `.concat(query);
  }
  return query;
}
