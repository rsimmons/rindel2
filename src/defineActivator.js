const zeroPad = (n, l) => {
  return (Array(l).join('0') + n.toString()).slice(-l);
};

export default (registerDefs) => {
  return (runtime, args, priority) => {
    const regs = [];
    const deactivators = [];
    const paddedPriorityLength = (registerDefs.length - 1).toString().length; // how long will zero-padded priority strings be

    for (const [opName, opArg] of registerDefs) {
      switch (opName) {
        case 'arg':
          regs.push(args[opArg]);
          break;

        case 'const':
          regs.push(runtime.createStream(opArg));
          break;

        // constant application, meaning function to be applied is a constant-stream (with value being an activator).
        //  both function and arguments are register indexes
        case 'capp':
          const [cappActivatorReg, cappArgsRegs] = opArg;
          const actPriority = priority + zeroPad(regs.length, paddedPriorityLength); // make zero-padded priority value for this primitive activation
          const cappActivator = regs[cappActivatorReg].value; // We get the current value because this is assumed to be a constant-stream
          const activation = cappActivator(runtime, cappArgsRegs.map(x => regs[x]), actPriority);
          regs.push(activation.outputStream);
          if (activation.deactivate) {
            deactivators.push(activation.deactivate);
          }
          break;

        default:
          throw new Error('unrecognized op');
      }
    }

    deactivators.reverse(); // This is probably not necessary

    return {
      outputStream: regs[regs.length-1],
      deactivate: () => {
        for (const d of deactivators) {
          d();
        }
      },
    };
  };
}
