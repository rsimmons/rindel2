import Runtime from './Runtime';
import createUserInputStreams from './createUserInputStreams';
import testPrograms from './testPrograms';

const runtime = new Runtime();
let currentProgram;
let currentActivation;

const programListElem = document.getElementById('program-list');
const stringOutputElem = document.getElementById('string-output');
const positionOutputElem = document.getElementById('position-output');

const displayOutput = () => {
  switch (currentProgram.outputInterpretation) {
    case 'stringable':
      stringOutputElem.textContent = currentActivation.outputStream.value.toString();
      break;

    case 'position':
      const {x, y} = currentActivation.outputStream.value;
      positionOutputElem.style.left = x;
      positionOutputElem.style.top = y;
      break;

    default:
      throw new Error('unrecognized interpretation');
  }
};

const getTime = () => {
  return 0.001*Date.now();
}

let rafID;
const runProgram = () => {
  if (!currentActivation) {
    return;
  }

  inputStreams.time.setValue(getTime());

  runtime.run();

  // If program depends on time input, and no outstanding call to requestAnimationFrame already, call to schedule
  if (inputStreams.time.hasDependentTasks() && !rafID) {
    rafID = window.requestAnimationFrame((highResTime) => {
      rafID = null;
      runProgram();
    });
  }

  displayOutput();
};

const inputStreams = createUserInputStreams(runtime, runProgram);
inputStreams.time = runtime.createStream(getTime());

const startProgram = (program) => {
  if (currentActivation) {
    currentActivation.deactivate();
  }

  // sanity check: make sure all input streams now have no dependent tasks
  for (const k in inputStreams) {
    if (inputStreams[k].hasDependentTasks()) {
      throw new Error('program did not fully deactivate?');
    }
  }

  stringOutputElem.style.display = 'none';
  positionOutputElem.style.display = 'none';

  currentProgram = program;
  currentActivation = program.activate(runtime, inputStreams);
  switch (program.outputInterpretation) {
    case 'stringable':
      stringOutputElem.style.display = 'block';
      break;

    case 'position':
      positionOutputElem.style.display = 'block';
      break;

    default:
      throw new Error('unrecognized interpretation');
  }
  runProgram();
}

for (const prog of testPrograms) {
  const anchorElem = document.createElement('a');
  anchorElem.textContent = prog.name;
  anchorElem.setAttribute('href', '#');
  (() => {
    anchorElem.addEventListener('click', (e) => {
      e.preventDefault();
      startProgram(prog);
    });
  })();

  const itemElem = document.createElement('li');
  itemElem.appendChild(anchorElem);

  programListElem.appendChild(itemElem);
}

startProgram(testPrograms[0]);
