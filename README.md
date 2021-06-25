# MS SQL server change tracking functions

This node.js module written in Typescript and uses [mssql](https://www.npmjs.com/package/mssql) under the hood to run the sql commands and provide high level functions to manage and work with MS SQL Change Tracking.

### Docs

- Module docs [here](https://saostad.github.io/mssql-change-tracking/)
- Microsoft docs [here](https://docs.microsoft.com/en-us/sql/relational-databases/track-changes/work-with-change-tracking-sql-server?view=sql-server-ver15)

### How to use

```sh
npm i mssql-change-tracking
```

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

### Note to begin

Before an application can obtain changes for the first time, the application must send a query to obtain the initial data and the synchronization version. The application must obtain the appropriate data directly from the table, and then use CHANGE_TRACKING_CURRENT_VERSION() to obtain the initial version. This version will be passed to CHANGETABLE(CHANGES ...) the first time that changes are obtained.
