/**
 * @param
 * - "@DBName"
 * - "@retentionDayNumber"
 */
export const changeTrackingDbEnableQuery = `
declare @sql nvarchar
set @sql = 'ALTER DATABASE [@DBName] 
SET CHANGE_TRACKING = ON  
(CHANGE_RETENTION = ' + @retentionDayNumber + 'DAYS, AUTO_CLEANUP = ON)';

exec(@sql);`;
