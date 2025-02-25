import {
  createConsumptionApi,
  ConsumptionHelpers as CH,
} from "@514labs/moose-lib";
import { tags } from "typia";

// This file is where you can define your APIs to consume your data
interface QueryParams {
  orderBy: "totalRows" | "rowsWithText" | "maxTextLength" | "totalTextLength";
  limit?: number;
  startDay?: number & tags.Type<"int32"> & tags.Minimum<1> & tags.Maximum<31>;
  endDay?: number & tags.Type<"int32"> & tags.Minimum<1> & tags.Maximum<31>;
}

// createConsumptionApi uses compile time code generation to generate a parser for QueryParams
export default createConsumptionApi<QueryParams>(
  async (
    { orderBy = "totalRows", limit = 5, startDay = 1, endDay = 31 },
    { client, sql }
  ) => {
    const query = sql`
      SELECT 
        dayOfMonth,
        ${CH.column(orderBy)}
      FROM BarAggregated_MV
      WHERE 
        dayOfMonth >= ${startDay} 
        AND dayOfMonth <= ${endDay}
      ORDER BY ${CH.column(orderBy)} DESC
      LIMIT ${limit}
    `;

    const data = await client.query<{
      dayOfMonth: number;
      totalRows?: number;
      rowsWithText?: number;
      maxTextLength?: number;
      totalTextLength?: number;
    }>(query);

    return data;
  }
);
