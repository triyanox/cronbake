import { Cron } from '@/lib';
import { CronOptions, IBaker, IBakerOptions, ICron, Status } from '@/lib/types';

/**
 * A class that implements the `IBaker` interface and provides methods to manage cron jobs.
 */
class Baker implements IBaker {
  private crons: Map<string, ICron> = new Map();

  constructor(options: IBakerOptions = {}) {
    if (options.autoStart) {
      this.bakeAll();
    }
  }

  add<T extends string = string>(options: CronOptions<T>): ICron<T> {
    const cron = Cron.create(options);
    this.crons.set(cron.name, cron);
    return cron;
  }

  remove(name: string): void {
    const cron = this.crons.get(name);
    if (cron) {
      cron.destroy();
      this.crons.delete(name);
    }
  }

  bake(name: string): void {
    const cron = this.crons.get(name);
    if (cron) {
      cron.start();
    }
  }

  stop(name: string): void {
    const cron = this.crons.get(name);
    if (cron) {
      cron.stop();
    }
  }

  destroy(name: string): void {
    const cron = this.crons.get(name);
    if (cron) {
      cron.destroy();
      this.crons.delete(name);
    }
  }

  getStatus(name: string): Status {
    const cron = this.crons.get(name);
    return cron ? cron.getStatus() : 'stopped';
  }

  isRunning(name: string): boolean {
    const cron = this.crons.get(name);
    return cron ? cron.isRunning() : false;
  }

  lastExecution(name: string): Date {
    const cron = this.crons.get(name);
    return cron ? cron.lastExecution() : new Date();
  }

  nextExecution(name: string): Date {
    const cron = this.crons.get(name);
    return cron ? cron.nextExecution() : new Date();
  }

  remaining(name: string): number {
    const cron = this.crons.get(name);
    return cron ? cron.remaining() : 0;
  }

  time(name: string): number {
    const cron = this.crons.get(name);
    return cron ? cron.time() : 0;
  }

  bakeAll(): void {
    this.crons.forEach((cron) => cron.start());
  }

  stopAll(): void {
    this.crons.forEach((cron) => cron.stop());
  }

  destroyAll(): void {
    this.crons.forEach((cron) => cron.destroy());
    this.crons.clear();
  }

  /**
   * Creates a new instance of `Baker`.
   */
  public static create(options: IBakerOptions = {}) {
    return new Baker(options);
  }
}

export default Baker;
