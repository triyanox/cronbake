import { Baker, Cron, CronParser } from '@/dist';
import {
  expect,
  describe,
  it,
  afterEach,
  beforeEach,
  jest,
  Mock,
} from 'bun:test';

describe('Baker', () => {
  let baker: Baker;
  beforeEach(() => {
    baker = new Baker();
  });

  afterEach(() => {
    baker.destroyAll();
  });

  it('Should check all the presets', () => {
    const presets = ['@daily', '@hourly', '@monthly', '@weekly', '@yearly'];
    presets.forEach((preset) => {
      const parser = new CronParser(preset);
      const cronTime = parser.parse();
      expect(cronTime).toBeDefined();
    });
  });

  it('should add a cron job', () => {
    const cron = baker.add({
      name: 'test',
      cron: '* * * * * *',
      callback: jest.fn(),
    });
    expect(cron).toBeDefined();
  });

  it('should remove a cron job', () => {
    baker.add({
      name: 'test',
      cron: '* * * * * *',
      callback: jest.fn(),
    });
    baker.remove('test');
    expect(baker.isRunning('test')).toBeFalsy();
  });

  it('should start a cron job', () => {
    baker.add({
      name: 'test',
      cron: '* * * * * *',
      callback: jest.fn(),
    });
    baker.bake('test');
    expect(baker.isRunning('test')).toBeTruthy();
  });

  it('should stop a cron job', () => {
    baker.add({
      name: 'test',
      cron: '* * * * * *',
      callback: jest.fn(),
    });
    baker.bake('test');
    baker.stop('test');
    expect(baker.isRunning('test')).toBeFalsy();
  });

  it('should destroy a cron job', () => {
    baker.add({
      name: 'test',
      cron: '* * * * * *',
      callback: jest.fn(),
    });
    baker.destroy('test');
    expect(baker.isRunning('test')).toBeFalsy();
  });

  it('should start all cron jobs', () => {
    baker.add({
      name: 'test1',
      cron: '* * * * * *',
      callback: jest.fn(),
    });
    baker.add({
      name: 'test2',
      cron: '* * * * * *',
      callback: jest.fn(),
    });
    baker.bakeAll();
    expect(baker.isRunning('test1')).toBeTruthy();
    expect(baker.isRunning('test2')).toBeTruthy();
  });

  it('should stop all cron jobs', () => {
    baker.add({
      name: 'test1',
      cron: '* * * * * *',
      callback: jest.fn(),
    });
    baker.add({
      name: 'test2',
      cron: '* * * * * *',
      callback: jest.fn(),
    });
    baker.bakeAll();
    baker.stopAll();
    expect(baker.isRunning('test1')).toBeFalsy();
    expect(baker.isRunning('test2')).toBeFalsy();
  });

  it('should destroy all cron jobs', () => {
    baker.add({
      name: 'test1',
      cron: '* * * * * *',
      callback: jest.fn(),
    });
    baker.add({
      name: 'test2',
      cron: '* * * * * *',
      callback: jest.fn(),
    });
    baker.destroyAll();
    expect(baker.isRunning('test1')).toBeFalsy();
    expect(baker.isRunning('test2')).toBeFalsy();
  });
});

describe('CronParser', () => {
  let parser: CronParser<string>;

  beforeEach(() => {
    parser = new CronParser('* * * * * *');
  });

  it('should parse the cron expression', () => {
    const cronTime = parser.parse();
    expect(cronTime).toBeDefined();
  });

  it('should get the next execution time', () => {
    const nextExecution = parser.getNext();
    expect(nextExecution).toBeInstanceOf(Date);
  });

  it('should get the previous execution time', () => {
    const previousExecution = parser.getPrevious();
    expect(previousExecution).toBeInstanceOf(Date);
  });
});

describe('Cron', () => {
  let cron: Cron;

  beforeEach(() => {
    cron = new Cron({
      name: 'test',
      cron: '* * * * * *',
      callback: jest.fn(),
    });
  });

  afterEach(() => {
    cron.destroy();
  });

  it('should start the cron job', () => {
    cron.start();
    expect(cron.isRunning()).toBeTruthy();
  });

  it('should stop the cron job', () => {
    cron.start();
    cron.stop();
    expect(cron.isRunning()).toBeFalsy();
  });

  it('should destroy the cron job', () => {
    cron.destroy();
    expect(cron.isRunning()).toBeFalsy();
  });

  it('should get the status of the cron job', () => {
    const status = cron.getStatus();
    expect(status).toBeDefined();
  });

  it('should check if the cron job is running', () => {
    const isRunning = cron.isRunning();
    expect(isRunning).toBeFalsy();
  });

  it('should get the date of the last execution of the cron job', () => {
    const lastExecution = cron.lastExecution();
    expect(lastExecution).toBeInstanceOf(Date);
  });

  it('should get the date of the next execution of the cron job', () => {
    const nextExecution = cron.nextExecution();
    expect(nextExecution).toBeInstanceOf(Date);
  });

  it('should get the remaining time until the next execution of the cron job', () => {
    const remaining = cron.remaining();
    expect(remaining).toBeDefined();
  });

  it('should get the time until the next execution of the cron job', () => {
    const time = cron.time();
    expect(time).toBeDefined();
  });
});
