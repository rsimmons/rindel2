export class Stream {
  constructor(runtime, value) {
    this.runtime = runtime;
    this.value = value;
    this.dependentTasks = {}; // map from priority to {taskFunc, count}. count is needed because same task might be multiply registered
  }

  setValue(newValue) {
    this.value = newValue;

    // Insert tasks that depend on this stream
    for (const priority in this.dependentTasks) {
      this.runtime.addTask(priority, this.dependentTasks[priority].taskFunc);
    }
  }

  addDependentTask(priority, taskFunc) {
    // sanity check
    const dt = this.dependentTasks[priority];
    if (dt === undefined) {
      this.dependentTasks[priority] = {taskFunc: taskFunc, count: 1};
    } else {
      // sanity checks
      if (dt.taskFunc !== taskFunc) {
        throw new Error('same priority but different taskFunc');
      }

      dt.count++;
    }
  }

  removeDependentTask(priority, taskFunc) {
    const dt = this.dependentTasks[priority];

    // sanity checks
    if (dt === undefined) {
      throw new Error('priority entry not found');
    }
    if (dt.taskFunc !== taskFunc) {
      throw new Error('same priority but different taskFunc');
    }
    if (dt.count < 1) {
      throw new Error('bad count');
    }

    dt.count--;

    if (dt.count === 0) {
      delete this.dependentTasks[priority];
    }
  }

  hasDependentTasks() {
    return (Object.keys(this.dependentTasks).length > 0);
  }
}
