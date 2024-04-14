import {
  type CronExpressionType,
  type CronOptions,
  type CronTime,
  type ICron,
  type ICronParser,
  type Status,
} from '@/lib/types';
import { CronParser } from '@/lib';
import { CBResolver } from '@/lib/utils';

/**
 * A class that implements the `ICron` interface and provides methods manage a cron job.
 */
class Cron<T extends string = string> implements ICron<T> {
  name: string;
  cron: CronExpressionType<T>;
  callback: () => void;
  onTick: () => void;
  onComplete: () => void;
  private interval: Timer | null = null;
  private next: Date | null = null;
  private status: Status = 'stopped';
  private parser: ICronParser;

  /**
   * Creates a new instance of the `Cron` class.
   */
  constructor(options: CronOptions<T>) {
    this.name = options.name;
    this.cron = options.cron;
    this.callback = CBResolver.bind(this, options.callback);
    this.onTick = CBResolver.bind(this, options.onTick);
    this.onComplete = CBResolver.bind(this, options.onComplete);
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.destroy = this.destroy.bind(this);
    this.getStatus = this.getStatus.bind(this);
    this.isRunning = this.isRunning.bind(this);
    this.lastExecution = this.lastExecution.bind(this);
    this.nextExecution = this.nextExecution.bind(this);
    this.remaining = this.remaining.bind(this);
    this.time = this.time.bind(this);
    this.parser = new CronParser(this.cron);
    if (options.start) {
      this.start();
    }
  }

  start(): void {
    if (this.status === 'running') {
      return;
    }
    this.status = 'running';
    this.next = this.parser.getNext();
    this.interval = setInterval(() => {
      if (this.next && this.next.getTime() <= Date.now()) {
        this.callback();
        this.onTick();
        this.next = this.parser.getNext();
      }
    }, 1000);
  }

  stop(): void {
    if (this.status === 'stopped') {
      return;
    }
    this.status = 'stopped';
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  destroy(): void {
    this.stop();
    this.onComplete();
  }

  getStatus(): Status {
    return this.status;
  }

  isRunning(): boolean {
    return this.status === 'running';
  }

  lastExecution(): Date {
    return this.parser.getPrevious();
  }

  nextExecution(): Date {
    return this.next || new Date();
  }

  remaining(): number {
    return this.next ? this.next.getTime() - Date.now() : 0;
  }

  time(): number {
    return Date.now();
  }

  /**
   * Creates a new cron job with the specified options.
   * @returns A new `ICron` object representing the cron job.
   */
  static create<T extends string = string>(options: CronOptions<T>): ICron<T> {
    return new Cron(options);
  }

  /**
   * Parses the specified cron expression and returns a `CronTime` object.
   * @returns A `CronTime` object representing the parsed cron expression.
   */
  static parse<T extends string = string>(
    cron: CronExpressionType<T>,
  ): CronTime {
    return new CronParser(cron).parse();
  }

  /**
   * Gets the next execution time for the specified cron expression.
   * @template T The type of the cron expression.
   * @returns A `Date` object representing the next execution time.
   */
  static getNext<T extends string = string>(cron: CronExpressionType<T>): Date {
    return new CronParser(cron).getNext();
  }

  /**
   * Gets the previous execution time for the specified cron expression.
   * @returns A `Date` object representing the previous execution time.
   */
  static getPrevious<T extends string = string>(
    cron: CronExpressionType<T>,
  ): Date {
    return new CronParser(cron).getPrevious();
  }

  /**
   * Checks if the specified string is a valid cron expression.
   * @returns `true` if the string is a valid cron expression, `false` otherwise.
   */
  static isCron<T extends string = string>(
    cron: CronExpressionType<T>,
  ): boolean {
    try {
      new CronParser(cron).parse();
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Checks if the specified string is a valid cron expression.
   * @returns `true` if the string is a valid cron expression, `false` otherwise.
   */
  static isValid<T extends string = string>(
    cron: CronExpressionType<T>,
  ): boolean {
    return Cron.isCron(cron);
  }
}

export default Cron;
