import PriorityQueue from './PriorityQueue';
import {Stream} from './streams';

export default class Runtime {
  constructor() {
    this.priorityQueue = new PriorityQueue();
  }

  createStream(value) {
    return new Stream(this, value);
  }

  run() {
    while (!this.priorityQueue.isEmpty()) {
      const nextTaskFunc = this.priorityQueue.pop();
      nextTaskFunc();
    }
  }

  addTask(priority, taskFunc) {
    this.priorityQueue.insert(priority, taskFunc);
  }
}
