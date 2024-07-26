// ==UserScript==
// @name        DotCoin clicker
// @namespace   Violentmonkey Scripts
// @match       https://dot.dapplab.xyz/*
// @match       https://app.dotcoin.bot/*
// @grant       none
// @version     1.0
// @author      sunri5e
// ==/UserScript==

const delay = ms => new Promise(res => setTimeout(res, ms));

(async () => {
  await delay(5000);

  function getRandomMs(base, max) {
    return base + Math.floor(Math.random() * max);
  }

  function simulateTouchStart(element) {
    if (!element) {
        console.error('Element is required');
        return;
    }

    var touchObj = new Touch({
        identifier: Date.now(),
        target: element,
        clientX: element.getBoundingClientRect().left,
        clientY: element.getBoundingClientRect().top,
        pageX: element.getBoundingClientRect().left,
        pageY: element.getBoundingClientRect().top,
        radiusX: 2.5,
        radiusY: 2.5,
        rotationAngle: 10,
        force: 0.5,
    });

    var touchEvent = new TouchEvent('touchstart', {
        bubbles: true,
        cancelable: true,
        touches: [touchObj],
        targetTouches: [touchObj],
        changedTouches: [touchObj],
        shiftKey: true, // you can set other properties as needed
    });

    element.dispatchEvent(touchEvent);
  }

  function startTapping() {
    console.log('Starting tapping...');
    const clickerCoin = document.querySelector('.ClickerCoin');
    const clickerCoinDot = document.querySelector('.ClickerCoinDot');
    const scoreBarInfoLimit = document.querySelector('.ScoreBarInfoLimit');
    const progressBar = document.querySelector('.ProgressBarFill');

    if (!clickerCoin || !clickerCoinDot || !scoreBarInfoLimit) {
        console.error('Required elements not found!');
        document.body.appendChild(finishBanner);
        return;
    }

    function startTapSimulation(element, initialFrequency) {
      let currentFrequency = initialFrequency;
      let tapInterval;

      function adjustFrequency() {
          const elementWidth = element.getBoundingClientRect().width;
          const progressBarWidth = progressBar.getBoundingClientRect().width;
          const windowWidth = window.innerWidth;
          console.log(`Element width: ${elementWidth}, Progress bar width: ${progressBarWidth/windowWidth}`);

          if (elementWidth > 180 && progressBarWidth/windowWidth < 0.15) {
            clearInterval(tapInterval);
            currentFrequency = getRandomMs(100, 100);
            tapInterval = setInterval(tap, currentFrequency);
            console.log('Tapping more frequently');
          } else if (elementWidth > 180) {
              clearInterval(tapInterval);
              currentFrequency = getRandomMs(300, 200);
              tapInterval = setInterval(tap, currentFrequency);
              console.log('Tapping less frequently');
          } else if (elementWidth <= 180) {
              clearInterval(tapInterval);
              currentFrequency = getRandomMs(100, 100);
              tapInterval = setInterval(tap, currentFrequency);
              console.log('Tapping more frequently');
          }
      }

      function tap() {
        if (scoreBarInfoLimit && scoreBarInfoLimit.textContent.trim() === '0') {
            clearInterval(tapInterval); // Stop the interval
            console.log('Stopping script as the value is 0');
            document.body.appendChild(finishBanner);
            return; // Stop execution
        }

        simulateTouchStart(element);
        adjustFrequency();
      }

      tapInterval = setInterval(tap, currentFrequency);
    }

    startTapSimulation(clickerCoinDot, 2000);
  }
  
  const finishBanner = document.createElement('div');
  finishBanner.className = 'finish-banner';
  finishBanner.textContent = 'Window can be closed now';

  const style = document.createElement('style');
  style.textContent = `
    .finish-banner {
      position: fixed;
      bottom: 150px;
      left: 20px;
      background-color: rgba(36, 146, 255, 0.8);
      color: #fff;
      border: none;
      border-radius: 20px;
      width: auto;
      height: 40px;
      font-size: 18px;
      cursor: pointer;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      z-index: 9999;
      padding: 6px 20px;
    }
  `;
  document.head.appendChild(style);

  startTapping();
})();
