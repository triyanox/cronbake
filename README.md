# Cronbake - A Powerful and Flexible Cron Job Manager powered by Bun

Cronbake is a powerful and flexible cron job manager built with TypeScript powered by Bun. It provides an easy-to-use interface for scheduling and managing cron jobs with a wide range of options and features. Cronbake is designed to be lightweight, efficient, and highly configurable, making it suitable for a variety of use cases.

### Features

#### Expressive Cron Expressions

Cronbake supports a wide range of cron expressions, including standard formats, ranges, steps, lists, and presets. You can use the following formats or presets:

- **Wildcards**: `* * * * * *` (second minute hour day month day-of-week)
- **Ranges**: `1-10 * * * * *`
- **Steps**: `1-10/2 * * * * *` (can be used with wildcards and ranges)
- **Lists**: `1,2,3 * * * * *`
- **Presets**:
  - `@every_second`
  - `@every_minute`
  - `@yearly` or `@annually`
  - `@monthly`
  - `@weekly`
  - `@daily`
  - `@hourly`
- **Custom Presets**: (as for now you can only use one presets at a time for each cron job in the format of `@<preset>_<value>` the support for multiple presets will be added in the future)
  - `@every_<number>_<unit>` (where `<unit>` is one of `seconds`, `minutes`, `hours`, `dayOfMonth`, `months`, `dayOfWeek`)
  - `@at_<hour>:<minute>` (where `<hour>` is a number between 0 and 23, and `<minute>` is a number between 0 and 59)
  - `@on_<day>` (where `<day>` is one of `sunday`, `monday`, `tuesday`, `wednesday`, `thursday`, `friday`, `saturday`)
  - `@between_<hour>_<hour>` (where `<hour>` is a number between 0 and 23)

This a simple graph to show how the cron expression works:

```plaintext
* * * * * * (second minute hour day month day-of-week)
| | | | | |
| | | | | +-- day of the week (0 - 6) (Sunday to Saturday)
| | | | +---- month (1 - 12)
| | | +------ day of the month (1 - 31)
| | +-------- hour (0 - 23)
| +---------- minute (0 - 59)
+------------ second (0 - 59)
```

#### Cron Job Management

Cronbake provides a simple and intuitive interface for managing cron jobs. You can easily add, remove, start, stop, and destroy cron jobs using the `Baker` class.

#### Real-time Status

Cronbake allows you to get the current status, last execution time, next execution time, and remaining time for each cron job. This information can be useful for monitoring and debugging purposes.

#### Callbacks

With Cronbake, you can execute custom functions when a cron job ticks (runs) or completes. This allows you to perform any necessary actions or side effects related to your cron job.

#### Type-safe

Cronbake is built with TypeScript, ensuring type safety and better tooling support. This helps catch errors during development and provides better code navigation and auto-completion.

### Installation

You can install Cronbake using your preferred package manager:

```bash
# With Bun
bun add cronbake

# With npm
npm install cronbake

# With yarn
yarn add cronbake

# With pnpm
pnpm add cronbake
```

### Usage

To get started with Cronbake, create a new instance of the `Baker` class and add cron jobs using the `add` method:

```typescript
import Baker from 'cronbake';

// Create a new Baker instance
const baker = Baker.create();

// Add a cron job that runs daily at midnight
const dailyJob = baker.add({
  name: 'daily-job',
  cron: '0 0 0 * * *', // Runs daily at midnight
  callback: () => {
    console.log('Daily job executed!');
  },
});

// Runs every first 3 minutes for the first 3 hours of every day
const everyFirst3MinutesJob = baker.add({
  name: 'every-first-3-minutes-job',
  cron: '0 0-3 1,2,3 * * *', // Runs every first 3 minutes for the first 3 hours of every day
  callback: () => {
    console.log('Every first 3 minutes job executed!');
  },
});

// using custom presets
const everyMinuteJob = baker.add({
  name: 'every-minute-job',
  cron: '@every_minute',
  callback: () => {
    console.log('Every minute job executed!');
  },
});

// Start all cron jobs
baker.bakeAll();
```

You can manage cron jobs using the various methods provided by the `Baker` class, such as `remove`, `stop`, `destroy`, `getStatus`, `isRunning`, `lastExecution`, `nextExecution`, `remaining`, and `time`.

| Method | Description |
| --- | --- |
| `add(options: CronOptions<T>)` | Adds a new cron job to the baker. |
| `remove(name: string)` | Removes a cron job from the baker. |
| `bake(name: string)` | Starts a cron job. |
| `stop(name: string)` | Stops a cron job. |
| `destroy(name: string)` | Destroys a cron job. |
| `getStatus(name: string)` | Returns the status of a cron job. |
| `isRunning(name: string)` | Checks if a cron job is running. |
| `lastExecution(name: string)` | Returns the last execution time of a cron job. |
| `nextExecution(name: string)` | Returns the next execution time of a cron job. |
| `remaining(name: string)` | Returns the remaining time until the next execution of a cron job. |
| `time(name: string)` | Returns the current time of a cron job. |
| `bakeAll()` | Starts all cron jobs. |
| `stopAll()` | Stops all cron jobs. |
| `destroyAll()` | Destroys all cron jobs. |
| `static create(options: IBakerOptions)` | Creates a new instance of `Baker`. |


#### Advanced Usage

Cronbake also provides a `Cron` class that you can use directly to create and manage individual cron jobs. This can be useful if you need more granular control over cron job instances.

```typescript
import { Cron } from 'cronbake';

// Create a new Cron instance
const job = Cron.create({
  name: 'custom-job',
  cron: '1-10/2 1,2,3 * * * *', // Runs every 2 seconds in the first 3 minutes of every hour
  callback: () => {
    console.log('Custom job executed!');
  },
  onTick: () => {
    console.log('Job ticked!');
  },
  onComplete: () => {
    console.log('Job completed!');
  },
});

// Start the cron job
job.start();
// Stop the cron job
job.stop();
// Get the job status
const status = job.getStatus();
// Get the next execution time
const nextExecution = job.nextExecution();
```

Cronbake also provides utility functions for parsing cron expressions, getting the next or previous execution times, and validating cron expressions.

```typescript
import { Cron } from 'cronbake';

// Parse a cron expression
const cronExpression = '0 0 0 * * *';
const cronTime = Cron.parse(cronExpression);
// Get the next execution time for a cron expression
const nextExecution = Cron.getNext(cronExpression);
// Get the previous execution time for a cron expression
const previousExecution = Cron.getPrevious(cronExpression);
// Check if a string is a valid cron expression
const isValid = Cron.isValid(cronExpression); // true
```

| Method | Description |
| --- | --- |
| `start()` | Starts the cron job. |
| `stop()` | Stops the cron job. |
| `getStatus()` | Returns the current status of the cron job. |
| `nextExecution()` | Returns the date of the next execution of the cron job. |
| `static parse(cron: CronExpressionType<T>)` | Parses the specified cron expression and returns a `CronTime` object. |
| `static getNext(cron: CronExpressionType<T>)` | Gets the next execution time for the specified cron expression. |
| `static getPrevious(cron: CronExpressionType<T>)` | Gets the previous execution time for the specified cron expression. |
| `static isValid(cron: CronExpressionType<T>)` | Checks if the specified string is a valid cron expression. |

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.

## License

Cronbake is released under the [MIT License](./LICENSE).