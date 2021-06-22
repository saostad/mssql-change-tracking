/** @param "@DbName" */
export const changeTrackingDbDisableQuery = `ALTER DATABASE @DbName  
SET CHANGE_TRACKING = OFF`;
