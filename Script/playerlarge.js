const controller = document.querySelector('input[type=range]');

const setProgress = (progress) => {
  const value = `${progress}%`;
}

setProgress(controller.value)
controller.oninput = () => {
  setProgress(controller.value)
}