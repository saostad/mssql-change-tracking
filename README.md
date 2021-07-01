# MS SQL server change tracking functions

This node.js module written in Typescript and uses [mssql](https://www.npmjs.com/package/mssql) under the hood to run the sql commands and provide high level functions to manage and work with MS SQL Change Tracking.

## Docs

- Module docs [here](https://saostad.github.io/mssql-change-tracking/)
- Microsoft docs [here](https://docs.microsoft.com/en-us/sql/relational-databases/track-changes/work-with-change-tracking-sql-server?view=sql-server-ver15)

## How to use

`npm i mssql mssql-change-tracking`

```ts
import { ctDbStatus } from "mssql-change-tracking";
import sql from "mssql";

const pool = new sql.ConnectionPool({
  server: "xxxx",
  user: "xxxx",
  password: "xxxx",
  database: "MY_DB_NAME",
});

await pool.connect();

const status = await ctDbStatus({ dbName: "MY_DB_NAME", pool });
console.log(status);
```

## Note to begin

Before an application can obtain changes for the first time, the application must send a query to obtain the initial data and the synchronization version. The application must obtain the appropriate data directly from the table, and then use CHANGE_TRACKING_CURRENT_VERSION() to obtain the initial version. This version will be passed to CHANGETABLE(CHANGES ...) the first time that changes are obtained.

## Obtaining Consistent and Correct Results ([reference](https://docs.microsoft.com/en-us/sql/relational-databases/track-changes/work-with-change-tracking-sql-server?view=sql-server-ver15#obtaining-consistent-and-correct-results))

Obtaining the changed data for a table requires multiple steps. Be aware that inconsistent or incorrect results could be returned if certain issues are not considered and handled.

For example, to obtain the changes that were made to a Sales table and SalesOrders table, an application would perform the following steps:

Validate the last synchronized version by using CHANGE_TRACKING_MIN_VALID_VERSION().

Obtain the version that can be used to obtain change the next time by using CHANGE_TRACKING_CURRENT_VERSION().

Obtain the changes for the Sales table by using CHANGETABLE(CHANGES ...).

Obtain the changes for the SalesOrders table by using CHANGETABLE(CHANGES ...).

Two processes are occurring in the database that can affect the results that are returned by the previous steps:

The cleanup process runs in the background and removes change tracking information that is older than the specified retention period.

The cleanup process is a separate background process that uses the retention period that is specified when you configure change tracking for the database. The issue is that the cleanup process can occur in the time between when the last synchronization version was validated and when the call to CHANGETABLE(CHANGES...) is made. A last synchronization version that was just valid might no longer be valid by the time the changes are obtained. Therefore, incorrect results might be returned.

Ongoing DML operations are occurring in the Sales and SalesOrders tables, such as the following operations:

Changes can be made to the tables after the version for next time has been obtained by using CHANGE_TRACKING_CURRENT_VERSION(). Therefore, more changes can be returned than expected.

A transaction could commit in the time between the call to obtain changes from the Sales table and the call to obtain changes from the SalesOrders table. Therefore, the results for the SalesOrder table could have foreign key value that does not exist in the Sales table.

To overcome the previously listed challenges, we recommend that you use snapshot isolation. This will help to ensure consistency of change information and avoid race conditions that are related to the background cleanup task. If you do not use snapshot transactions, developing an application that uses change tracking could require significantly more effort.
