# MS SQL server change tracking functions

This node.js module written in Typescript and uses [mssql](https://www.npmjs.com/package/mssql) under the hood to run the sql commands and provide high level functions to manage and work with MS SQL Change Tracking.

### Docs [here](https://saostad.github.io/mssql-change-tracking/)

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
