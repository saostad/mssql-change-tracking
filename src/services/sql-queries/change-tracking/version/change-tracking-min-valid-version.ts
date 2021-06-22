/** @param "@tableName" */
export const changeTrackingMinValidVersionByTableNameQuery = `
SELECT CHANGE_TRACKING_MIN_VALID_VERSION(OBJECT_ID(@tableName)) AS min_valid_version
`;

/** @param "@tableId" */
export const changeTrackingMinValidVersionByTableIdQuery = `
SELECT CHANGE_TRACKING_MIN_VALID_VERSION(@tableId) AS min_valid_version
`;
