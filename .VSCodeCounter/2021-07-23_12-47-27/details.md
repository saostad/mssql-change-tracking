# Details

Date : 2021-07-23 12:47:27

Directory c:\Users\SOstad\Projects\__public-projects\mssql-change-tracking

Total : 46 files,  20035 codes, 436 comments, 469 blanks, all 20940 lines

[summary](results.md)

## Files
| filename | language | code | comment | blank | total |
| :--- | :--- | ---: | ---: | ---: | ---: |
| [.prettierrc](/.prettierrc) | JSON | 4 | 0 | 1 | 5 |
| [CHANGELOG.md](/CHANGELOG.md) | Markdown | 60 | 0 | 41 | 101 |
| [README.md](/README.md) | Markdown | 24 | 0 | 14 | 38 |
| [config/Dockerfile](/config/Dockerfile) | Docker | 7 | 2 | 1 | 10 |
| [config/_config.yml](/config/_config.yml) | YAML | 3 | 0 | 1 | 4 |
| [config/clean-start.js](/config/clean-start.js) | JavaScript | 41 | 6 | 12 | 59 |
| [config/compile.js](/config/compile.js) | JavaScript | 22 | 0 | 4 | 26 |
| [config/docker-build.js](/config/docker-build.js) | JavaScript | 53 | 10 | 17 | 80 |
| [config/github.js](/config/github.js) | JavaScript | 8 | 0 | 4 | 12 |
| [config/tag.js](/config/tag.js) | JavaScript | 21 | 0 | 5 | 26 |
| [config/vulnerability-scan.js](/config/vulnerability-scan.js) | JavaScript | 15 | 0 | 4 | 19 |
| [docker-compose.yml](/docker-compose.yml) | YAML | 13 | 18 | 2 | 33 |
| [docs/_config.yml](/docs/_config.yml) | YAML | 3 | 0 | 1 | 4 |
| [docs/assets/css/main.css](/docs/assets/css/main.css) | CSS | 2,340 | 170 | 151 | 2,661 |
| [docs/assets/js/main.js](/docs/assets/js/main.js) | JavaScript | 138 | 64 | 46 | 248 |
| [docs/assets/js/search.js](/docs/assets/js/search.js) | JavaScript | 1 | 0 | 0 | 1 |
| [docs/index.html](/docs/index.html) | HTML | 242 | 0 | 3 | 245 |
| [docs/modules.html](/docs/modules.html) | HTML | 1,299 | 0 | 0 | 1,299 |
| [package-lock.json](/package-lock.json) | JSON | 14,624 | 0 | 1 | 14,625 |
| [package.json](/package.json) | JSON | 89 | 15 | 1 | 105 |
| [src/helpers/util.ts](/src/helpers/util.ts) | TypeScript | 53 | 3 | 6 | 62 |
| [src/index.test.ts](/src/index.test.ts) | TypeScript | 3 | 0 | 1 | 4 |
| [src/index.ts](/src/index.ts) | TypeScript | 2 | 0 | 1 | 3 |
| [src/services/change-tracking/changes/change-tracking-changes-all-fields.ts](/src/services/change-tracking/changes/change-tracking-changes-all-fields.ts) | TypeScript | 121 | 27 | 18 | 166 |
| [src/services/change-tracking/changes/change-tracking-changes.ts](/src/services/change-tracking/changes/change-tracking-changes.ts) | TypeScript | 119 | 31 | 16 | 166 |
| [src/services/change-tracking/index.ts](/src/services/change-tracking/index.ts) | TypeScript | 17 | 0 | 1 | 18 |
| [src/services/change-tracking/manage/change-tracking-access-grant.ts](/src/services/change-tracking/manage/change-tracking-access-grant.ts) | TypeScript | 38 | 1 | 7 | 46 |
| [src/services/change-tracking/manage/change-tracking-access-status.ts](/src/services/change-tracking/manage/change-tracking-access-status.ts) | TypeScript | 81 | 7 | 7 | 95 |
| [src/services/change-tracking/manage/change-tracking-db-disable.ts](/src/services/change-tracking/manage/change-tracking-db-disable.ts) | TypeScript | 19 | 1 | 5 | 25 |
| [src/services/change-tracking/manage/change-tracking-db-enable.ts](/src/services/change-tracking/manage/change-tracking-db-enable.ts) | TypeScript | 47 | 1 | 7 | 55 |
| [src/services/change-tracking/manage/change-tracking-db-status.ts](/src/services/change-tracking/manage/change-tracking-db-status.ts) | TypeScript | 32 | 3 | 5 | 40 |
| [src/services/change-tracking/manage/change-tracking-table-disable.ts](/src/services/change-tracking/manage/change-tracking-table-disable.ts) | TypeScript | 37 | 1 | 8 | 46 |
| [src/services/change-tracking/manage/change-tracking-table-enable.ts](/src/services/change-tracking/manage/change-tracking-table-enable.ts) | TypeScript | 50 | 4 | 10 | 64 |
| [src/services/change-tracking/manage/change-tracking-table-status.ts](/src/services/change-tracking/manage/change-tracking-table-status.ts) | TypeScript | 31 | 7 | 5 | 43 |
| [src/services/change-tracking/manage/snapshot-isolation-disable.ts](/src/services/change-tracking/manage/snapshot-isolation-disable.ts) | TypeScript | 19 | 1 | 5 | 25 |
| [src/services/change-tracking/manage/snapshot-isolation-enable.ts](/src/services/change-tracking/manage/snapshot-isolation-enable.ts) | TypeScript | 19 | 1 | 5 | 25 |
| [src/services/change-tracking/manage/snapshot-isolation-status.ts](/src/services/change-tracking/manage/snapshot-isolation-status.ts) | TypeScript | 33 | 1 | 7 | 41 |
| [src/services/change-tracking/version/change-tracking-current-version.ts](/src/services/change-tracking/version/change-tracking-current-version.ts) | TypeScript | 24 | 4 | 7 | 35 |
| [src/services/change-tracking/version/change-tracking-is-version-valid-all-tables.ts](/src/services/change-tracking/version/change-tracking-is-version-valid-all-tables.ts) | TypeScript | 42 | 4 | 6 | 52 |
| [src/services/change-tracking/version/change-tracking-is-version-valid.ts](/src/services/change-tracking/version/change-tracking-is-version-valid.ts) | TypeScript | 105 | 6 | 10 | 121 |
| [src/services/change-tracking/version/change-tracking-min-valid-version.ts](/src/services/change-tracking/version/change-tracking-min-valid-version.ts) | TypeScript | 80 | 4 | 10 | 94 |
| [src/services/general/index.ts](/src/services/general/index.ts) | TypeScript | 1 | 0 | 1 | 2 |
| [src/services/general/primary-keys.ts](/src/services/general/primary-keys.ts) | TypeScript | 29 | 0 | 4 | 33 |
| [src/typings/node/mode.ts](/src/typings/node/mode.ts) | TypeScript | 1 | 0 | 1 | 2 |
| [src/typings/node/modules.d.ts](/src/typings/node/modules.d.ts) | TypeScript | 6 | 0 | 1 | 7 |
| [tsconfig.json](/tsconfig.json) | JSON | 19 | 44 | 6 | 69 |

[summary](results.md)