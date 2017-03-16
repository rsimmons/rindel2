import builtins from './builtins';
import defineActivator from './defineActivator';

export default [
  {
    name: 'mouseX plus 100',
    outputInterpretation: 'stringable',
    activate: (runtime, inputStreams) => {
      return defineActivator([
        ['arg', 0],
        ['const', 100],
        ['const', builtins.add],
        ['capp', [2, [0, 1]]],
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
        ['const', builtins.add],
        ['capp', [2, [0, 1]]],
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

  {
    name: 'follow mouse with x/y swapped',
    outputInterpretation: 'position',
    activate: (runtime, inputStreams) => {
      return defineActivator([
        ['arg', 0],
        ['arg', 1],
        ['const', builtins.Position],
        ['capp', [2, [1, 0]]],
      ])(runtime, [inputStreams.user.mouseX, inputStreams.user.mouseY], '');
    },
  },
]
