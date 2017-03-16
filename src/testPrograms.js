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
      ])(runtime, [inputStreams.mouseX], '');
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
      ])(runtime, [inputStreams.mouseX, inputStreams.mouseY], '');
    },
  },

  {
    name: 'follow mouse',
    outputInterpretation: 'position',
    activate: (runtime, inputStreams) => {
      return defineActivator([
        ['arg', 0],
      ])(runtime, [inputStreams.mousePos], '');
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
      ])(runtime, [inputStreams.mouseX, inputStreams.mouseY], '');
    },
  },

  {
    name: 'orbit mouse position',
    outputInterpretation: 'position',
    activate: (runtime, inputStreams) => {
      return defineActivator([
        ['arg', 0],
        ['arg', 1],
        ['arg', 2],
        ['const', builtins.add],
        ['const', builtins.mul],
        ['const', builtins.sin],
        ['const', builtins.cos],
        ['const', builtins.Position],
        ['const', 50], // radius
        ['const', 10], // time mult
        ['capp', [4, [9, 2]]], // 10*time
        ['capp', [6, [10]]], // cos(10*time)
        ['capp', [4, [8, 11]]], // 50*cos(10*time)
        ['capp', [3, [0, 12]]], // mouseX + 50*cos(10*time)
        ['capp', [5, [10]]], // sin(10*time)
        ['capp', [4, [8, 14]]], // 50*sin(10*time)
        ['capp', [3, [1, 15]]], // mouseY + 50*sin(10*time)
        ['capp', [7, [13, 16]]], // Position(mouseX + 50*cos(10*time), mouseY + 50*sin(10*time))
      ])(runtime, [inputStreams.mouseX, inputStreams.mouseY, inputStreams.time], '');
    },
  },

]
