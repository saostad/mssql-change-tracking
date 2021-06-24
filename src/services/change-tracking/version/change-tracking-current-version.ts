/**
 * @reference https://docs.microsoft.com/en-us/sql/relational-databases/track-changes/work-with-change-tracking-sql-server?view=sql-server-ver15#about-the-change-tracking-functions
 */
export function changeTrackingCurrentVersionQuery(): string {
  return `SELECT CHANGE_TRACKING_CURRENT_VERSION() AS current_version`;
}
