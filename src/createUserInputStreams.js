export default (runtime, inputUpdated) => {
  const inputStreams = {
    mouseX: runtime.createStream(0),
    mouseY: runtime.createStream(0),
    mousePos: runtime.createStream({x: 0, y: 0}),
    mouseDown: runtime.createStream(false),
  };

  document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX||e.pageX;
    const mouseY = e.clientY||e.pageY;
    inputStreams.mouseX.setValue(mouseX);
    inputStreams.mouseY.setValue(mouseY);
    inputStreams.mousePos.setValue({x: mouseX, y: mouseY});
    inputUpdated();
  });

  document.addEventListener('mousedown', (e) => {
    if (e.button === 0) {
      inputStreams.mouseDown.setValue(true);
      inputUpdated();
    }
  });

  document.addEventListener('mouseup', (e) => {
    if (e.button === 0) {
      inputStreams.mouseDown.setValue(false);
      inputUpdated();
    }
  });

  return inputStreams;
};
