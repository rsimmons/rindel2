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

const inputUpdated = () => {
  runtime.run();

  if (currentActivation) {
    displayOutput();
  }
};

const inputStreams = createUserInputStreams(runtime, inputUpdated);

const runProgram = (program) => {
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
  displayOutput();
}

for (const prog of testPrograms) {
  const anchorElem = document.createElement('a');
  anchorElem.textContent = prog.name;
  anchorElem.setAttribute('href', '#');
  (() => {
    anchorElem.addEventListener('click', (e) => {
      e.preventDefault();
      runProgram(prog);
    });
  })();

  const itemElem = document.createElement('li');
  itemElem.appendChild(anchorElem);

  programListElem.appendChild(itemElem);
}

runProgram(testPrograms[0]);
