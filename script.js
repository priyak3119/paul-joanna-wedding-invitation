(() => {
  /*
   * Compatibility wrapper for the approved invitation build.
   * It keeps the full existing invitation logic in script-original.js while
   * tightening only the opening sequence requested in the latest review.
   */
  const nativeSetTimeout = window.setTimeout.bind(window);
  const fasterOpeningDelays = new Map([
    [1050, 320],
    [1450, 560],
    [1750, 720],
    [2350, 980],
  ]);

  window.setTimeout = (handler, delay, ...args) =>
    nativeSetTimeout(handler, fasterOpeningDelays.get(delay) ?? delay, ...args);

  document.querySelector(".entry-note")?.remove();

  const invitationScript = document.createElement("script");
  invitationScript.src = "script-original.js?v=20260912";
  invitationScript.defer = false;
  document.body.appendChild(invitationScript);
})();
