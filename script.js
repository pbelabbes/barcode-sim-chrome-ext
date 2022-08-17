var pressKey = (letter) =>
  document.dispatchEvent(
    new KeyboardEvent("keydown", {
      key: letter,
    })
  );

var simulatebarCodeKeyboardInput = (barCode) => {
  barCode.split("").forEach((letter) => {
    pressKey(letter);
  });
};

simulatebarCodeKeyboardInput("1234");
