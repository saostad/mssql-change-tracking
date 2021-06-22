/** @param "@tableName" */
export const changeTrackingMinValidVersionQueryByTableName = `
SELECT CHANGE_TRACKING_MIN_VALID_VERSION(OBJECT_ID(@tableName)) AS min_valid_version
`;

/** @param "@tableId" */
export const changeTrackingMinValidVersionQueryByTableId = `
SELECT CHANGE_TRACKING_MIN_VALID_VERSION(@tableId) AS min_valid_version
`;
