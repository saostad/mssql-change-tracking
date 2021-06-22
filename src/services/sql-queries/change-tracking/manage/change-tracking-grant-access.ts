type ChangeTrackingGrantAccess = { tableName: string; userName: string };
export function changeTrackingGrantAccessQuery({
  tableName,
  userName,
}: ChangeTrackingGrantAccess) {
  return `GRANT VIEW CHANGE TRACKING on ${tableName} to ${userName}`;
}
