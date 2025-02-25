// Example streaming function: Reshapes Foo data to Bar format.

// Imports: Source (Foo) and Destination (Bar) data models.
import { Foo, Bar } from "datamodels/models";


// The 'run' function contains the logic that runs on each new data point in the Foo stream.
// For more details on how Moose streaming functions work, see: https://docs.moosejs.com
export default function run(foo: Foo): Bar {
  return {
    primaryKey: foo.primaryKey,
    utcTimestamp: new Date(foo.timestamp),
    textLength: foo.optionalText?.length ?? 0,
    hasText: foo.optionalText !== null,
  } as Bar;
}

