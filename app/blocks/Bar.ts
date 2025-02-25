// Example Block that creates a materialized view that aggregates daily statistics from Bar_0_0

import { Blocks } from "@514labs/moose-lib"; // Import Blocks to structure setup/teardown queries

const MV_NAME = "BarAggregated_MV";

const MV_QUERY = `
CREATE MATERIALIZED VIEW ${MV_NAME}
ENGINE = MergeTree()
ORDER BY dayOfMonth
POPULATE
AS
SELECT
  toDayOfMonth(utcTimestamp) as dayOfMonth,
  count(primaryKey) as totalRows,
  countIf(hasText) as rowsWithText,
  sum(textLength) as totalTextLength,
  max(textLength) as maxTextLength
FROM Bar_0_0
GROUP BY dayOfMonth
`;

const DROP_MV_QUERY = `
DROP TABLE IF EXISTS ${MV_NAME}
`;

export default {
  teardown: [DROP_MV_QUERY], // SQL to drop the materialized view if it exists
  setup: [MV_QUERY], // SQL to create a materialized view that aggregates daily statistics from Bar_0_0
} as Blocks;

