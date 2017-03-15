import Heap from 'heap';

export default class PriorityQueue {
  constructor() {
    this.heap = new Heap((a, b) => {
      // NOTE: We can't just return a.priority-b.priority because priorities are strings that we want lexicographically ordered
      return (a.priority < b.priority) ? -1 : ((b.priority > a.priority) ? 1 : 0);
    });
  }

  isEmpty() {
    return this.heap.empty();
  }

  // task is expected to have "priority" property that is a string
  insert(priority, data) {
    this.heap.push({priority, data});
  }

  pop() {
    return this.heap.pop().data;
  }
}
