const lift = (f) => {
  return (runtime, args, priority) => {
    const compute = () => {
      const v = f(...args.map(arg => arg.value));
      return v;
    }

    // Create output stream, setting initial value
    const out = runtime.createStream(compute());

    // task function
    const update = () => {
      out.setValue(compute());
    };

    for (const arg of args) {
      arg.addDependentTask(priority, update);
    }

    return {
      outputStream: out,
      deactivate: () => {
        for (const arg of args) {
          arg.removeDependentTask(priority, update);
        }
      },
    };
  };
};

export default {
  add: lift((a, b) => (a + b)),
  Position: lift((x, y) => ({x, y})),
}
