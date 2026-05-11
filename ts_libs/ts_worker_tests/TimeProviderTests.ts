import { TimeProvider } from "../ts_worker/infrastructure/time/TimeProvider";
import { Assert } from "./Assert";

export class TimeProviderTests {
    static async run(): Promise<void> {
        const timeProvider = new TimeProvider();

        // Get UTC milliseconds
        const millis = await timeProvider.getUtcNowMilliseconds(true);

        console.log({
            timeProvider: {
                millis,
                datetime: TimeProvider.formatUtc(millis),
            },
        });

        // Basic assertion
        Assert.assertTrue(millis !== null && millis > 0, "TimeProvider returned an invalid timestamp");
    }
}
