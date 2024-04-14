type CronTime = {
  second?: number[];
  minute?: number[];
  hour?: number[];
  dayOfMonth?: number[];
  month?: number[];
  dayOfWeek?: number[];
};

/**
 * Interface for a cron parser that can parse a cron expression and provide
 * the next and previous execution times.
 */
interface ICronParser {
  /**
   * Parse the cron expression and return a `CronTime` object.
   * @returns A `CronTime` object representing the parsed cron expression.
   */
  parse(): CronTime;

  /**
   * Get the next execution time based on the current time.
   * @returns A `Date` object representing the next execution time.
   */
  getNext(): Date;

  /**
   * Get the previous execution time based on the current time.
   * @returns A `Date` object representing the previous execution time.
   */
  getPrevious(): Date;
}

type unit =
  | 'seconds'
  | 'minutes'
  | 'hours'
  | 'dayOfMonth'
  | 'months'
  | 'dayOfWeek';

type day =
  | 'sunday'
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday';

type EveryStrType<U extends unit = unit> = `@every_${string}_${U}`;
type AtHourStrType = `@at_${number}:${number}`;
type OnDayStrType<D extends day = day> = `@on_${D}`;
type BetweenStrType = `@between_${number}_${number}`;

type CronExprs =
  | '@every_second'
  | '@every_minute'
  | '@yearly'
  | '@annually'
  | '@monthly'
  | '@weekly'
  | '@daily'
  | '@hourly'
  | EveryStrType
  | AtHourStrType
  | OnDayStrType
  | BetweenStrType;

type CronStr = `${string} ${string} ${string} ${string} ${string} ${string}`;
type CronExpression = CronExprs | CronStr;

/**
 * A type that takes a string and returns a `CronExprs` type if the string starts with '@',
 * otherwise returns the input string.
 */
type CronExpressionType<T extends string> = T extends `@${infer U}`
  ? CronExprs
  : T;

/**
 * An interface that defines the properties and methods of a cron job.
 * @template T The type of the cron expression.
 */
interface ICron<T extends string = string> {
  /**
   * The name of the cron job.
   */
  name: string;
  /**
   * The cron expression for the job.
   */
  cron: CronExpressionType<T>;
  /**
   * The callback function to execute on each tick of the cron job.
   */
  callback: () => void;
  /**
   * The function to execute on each tick of the cron job.
   */
  onTick: () => void;
  /**
   * The function to execute when the cron job completes.
   */
  onComplete: () => void;
  /**
   * Starts the cron job.
   */
  start: () => void;
  /**
   * Stops the cron job.
   */
  stop: () => void;
  /**
   * Destroys the cron job.
   */
  destroy: () => void;
  /**
   * Gets the status of the cron job.
   * @returns The status of the cron job.
   */
  getStatus: () => Status;
  /**
   * Checks if the cron job is running.
   * @returns `true` if the cron job is running, `false` otherwise.
   */
  isRunning: () => boolean;
  /**
   * Gets the date of the last execution of the cron job.
   * @returns The date of the last execution of the cron job.
   */
  lastExecution: () => Date;
  /**
   * Gets the date of the next execution of the cron job.
   * @returns The date of the next execution of the cron job.
   */
  nextExecution: () => Date;
  /**
   * Gets the remaining time until the next execution of the cron job.
   * @returns The remaining time until the next execution of the cron job.
   */
  remaining: () => number;
  /**
   * Gets the time until the next execution of the cron job.
   * @returns The time until the next execution of the cron job.
   */
  time: () => number;
}

/**
 * A type that defines the options for a cron job.
 * @template T The type of the cron expression.
 */
type CronOptions<T extends string = string> = {
  /**
   * The name of the cron job.
   */
  name: string;
  /**
   * The cron expression for the job.
   * You can use the following formats or you can use a preset
   * @example
   * // wildcards
   * "* * * * * *"
   * // ranges
   * "1-10 * * * * *"
   * // steps
   * "1-10/2 * * * * *" // can be used with wildcards and ranges
   * // lists
   * "1,2,3 * * * * *"
   * // presets
   * "@every_second"
   * "@every_minute"
   * "@yearly"
   * "@annually"
   * "@monthly"
   * "@weekly"
   * "@daily"
   * "@hourly"
   * // custom presets
   * "@every_<number>_<unit>"
   * // where <unit> is one of the following:
   * // "seconds", "minutes", "hours", "dayOfMonth", "months", "dayOfWeek"
   * "@at_<hour>:<minute>"
   * // where <hour> is a number between 0 and 23 and <minute> is a number between 0 and 59
   * "@on_<day>"
   * // where <day> is one of the following:
   * // "sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"
   * "@between_<hour>_<hour>"
   * // where hour is a number between 0 and 23
   */
  cron: CronExpressionType<T>;
  /**
   * The callback function to execute on each tick of the cron job.
   */
  callback: () => void;
  /**
   * The optional function to execute on each tick of the cron job.
   */
  onTick?: () => void;
  /**
   * The optional function to execute when the cron job completes.
   */
  onComplete?: () => void;
  /**
   * Whether to start the cron job immediately upon creation.
   */
  start?: boolean;
};

type Status = 'running' | 'stopped';

/**
 * An interface that defines the properties and methods of a baker.
 */
interface IBaker {
  /**
   * Adds a new cron job with the specified options.
   * @returns A new `ICron` object representing the cron job.
   */
  add: (options: CronOptions) => ICron;

  /**
   * Removes the cron job with the specified name.
   */
  remove: (name: string) => void;

  /**
   * Starts the cron job with the specified name.
   */
  bake: (name: string) => void;

  /**
   * Stops baking the cron job with the specified name.
   */
  stop: (name: string) => void;

  /**
   * Destroys the cron job with the specified name.
   */
  destroy: (name: string) => void;

  /**
   * Gets the status of the cron job with the specified name.
   * @returns The status of the cron job.
   */
  getStatus: (name: string) => string;

  /**
   * Checks if the cron job with the specified name is running.
   * @returns `true` if the cron job is running, `false` otherwise.
   */
  isRunning: (name: string) => boolean;

  /**
   * Gets the date of the last execution of the cron job with the specified name.
   * @returns The date of the last execution of the cron job.
   */
  lastExecution: (name: string) => Date;

  /**
   * Gets the date of the next execution of the cron job with the specified name.
   * @returns The date of the next execution of the cron job.
   */
  nextExecution: (name: string) => Date;

  /**
   * Gets the remaining time until the next execution of the cron job with the specified name.
   * @returns The remaining time until the next execution of the cron job.
   */
  remaining: (name: string) => number;

  /**
   * Gets the time until the next execution of the cron job with the specified name.
   * @returns The time until the next execution of the cron job.
   */
  time: (name: string) => number;

  /**
   * Starts all cron jobs.
   */
  bakeAll: () => void;

  /**
   * Stops all cron jobs.
   */
  stopAll: () => void;

  /**
   * Destroys all cron jobs.
   */
  destroyAll: () => void;
}

interface IBakerOptions {
  autoStart?: boolean;
}

export {
  type CronTime,
  type ICronParser,
  type CronExpression,
  type CronExpressionType,
  type EveryStrType,
  type AtHourStrType,
  type OnDayStrType,
  type BetweenStrType,
  type unit,
  type day,
  type CronExprs,
  type ICron,
  type CronOptions,
  type Status,
  type IBaker,
  type IBakerOptions,
};
