import defineActivator from './defineActivator';

export default [
  {
    name: 'mouseX plus 100',
    outputInterpretation: 'stringable',
    activate: (runtime, inputStreams) => {
      return defineActivator([
        ['arg', 0],
        ['const', 100],
        ['prim', ['add', [0, 1]]],
      ])(runtime, [inputStreams.user.mouseX], '');
    },
  },

  {
    name: 'mouseX plus mouseY',
    outputInterpretation: 'stringable',
    activate: (runtime, inputStreams) => {
      return defineActivator([
        ['arg', 0],
        ['arg', 1],
        ['prim', ['add', [0, 1]]],
      ])(runtime, [inputStreams.user.mouseX, inputStreams.user.mouseY], '');
    },
  },

  {
    name: 'follow mouse',
    outputInterpretation: 'position',
    activate: (runtime, inputStreams) => {
      return defineActivator([
        ['arg', 0],
      ])(runtime, [inputStreams.user.mousePos], '');
    },
  },
]
