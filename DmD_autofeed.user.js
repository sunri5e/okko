// ==UserScript==
// @name        duckmyduck autofeed 2
// @namespace   Violentmonkey Scripts
// @match       *://webapp.duckmyduck.com/*
// @grant       none
// @version     1.0
// @author      -
// @description 28.11.2024 г., 18:06:08 ч.
// ==/UserScript==

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function delay(ms) {
    const time = ms || animDelay;

  console.log('Wait ' + time + 'ms')

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, time);
    });
  }

function getElementPosition(element) {
  let current_element = element;
  let elTop = 0,
    elLeft = 0;
  do {
    elTop += current_element.offsetTop || 0;
    elLeft += current_element.offsetLeft || 0;
    current_element = current_element.offsetParent;
  } while (current_element);
  return {
    elTop,
    elLeft
  };
}

function waitForElm(selector) {
  return new Promise(resolve => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver(mutations => {
      if (document.querySelector(selector)) {
        observer.disconnect();
        resolve(document.querySelector(selector));
      }
    });

    // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
}

(function() {
  const activeSelector = 'div.top-0.absolute.ml-5.z-20';
  const balanceLimit = 50;
  const animDelay = 2000;
  const maxTaps = 79;
  const minTaps = 2;

  function startFeeding(callback) {
    const buttonElement = document.querySelector(activeSelector);
    let { elTop, elLeft } = getElementPosition(buttonElement);
    const tapsLimit = getRandomInt(minTaps, maxTaps);
    var tapCount = 0;

    // Function to tap at intervals
    function tapAtInterval() {
      const ballance = document.querySelector('#corn-balance .text-right').innerText;
      if (+ballance < balanceLimit) {
        console.log('Не вистачає балансу.');
        return;
      }


      const breedingButton = document.querySelector('.start-breeding-button');
      if (breedingButton) {
        console.log('Кнопка start-breeding-button знайдена. Переходимо до наступного айтема.');
        callback();
        return; // Зупиняємо тапання для цього елемента
      }

      const randomX = Math.floor(elLeft + Math.random() * buttonElement.offsetWidth);
      const randomY = Math.floor(elTop + Math.random() * buttonElement.offsetHeight);
      const pointerDownEvent = new PointerEvent('pointerdown', {
        clientX: randomX,
        clientY: randomY
      });
      const pointerUpEvent = new PointerEvent('pointerup', {
        clientX: randomX,
        clientY: randomY
      });

      // Check if the tap count has reached the maximum number of executions
      if (tapCount >= tapsLimit) {
        console.log('Stopped tapping after ' + tapsLimit + ' executions.');
        callback();
        return;
      }
      buttonElement.dispatchEvent(pointerDownEvent);
      buttonElement.dispatchEvent(pointerUpEvent);
      tapCount++;

      var interval = 100 + getRandomInt(0, 200);
      setTimeout(tapAtInterval, interval);
    }

    tapAtInterval();
  }

  async function feedDucks(callback) {
    const feedingList = document.querySelectorAll("[src*='/img/slides-bages/feeding']");
    const ballance = document.querySelector('#corn-balance .text-right').innerText;
    console.log('feedingList', feedingList);

    if (+ballance > balanceLimit) {
      for (let item of feedingList) {
        await delay(getRandomInt(2000, 3000));

        item.click();

        await delay(getRandomInt(2000, 3000));

        await new Promise((resolve) => {
          startFeeding(resolve);
        });

        console.log('Закінчили роботу з елементом', item);
      }

      console.log('Усі качки нагодовані.');
    } else {
      console.log('Не вистачає балансу.');
    }

    callback();
  }

  function heartsCollecting() {
    const buttonElement = document.querySelector(activeSelector);
    let { elTop, elLeft } = getElementPosition(buttonElement);
    const randomX = Math.floor(elLeft + Math.random() * buttonElement.offsetWidth);
    const randomY = Math.floor(elTop + Math.random() * buttonElement.offsetHeight);
    const pointerDownEvent = new PointerEvent('pointerdown', {
      clientX: randomX,
      clientY: randomY
    });
    const pointerUpEvent = new PointerEvent('pointerup', {
      clientX: randomX,
      clientY: randomY
    });

    buttonElement.dispatchEvent(pointerDownEvent);
    buttonElement.dispatchEvent(pointerUpEvent);
  }

  async function collectHearts(callback) {
    const breedingDucks = document.querySelectorAll("[src*='/img/slides-bages/breeding']");
    console.log('breedingDucks', breedingDucks);

    for (let item of breedingDucks) {
      await delay(getRandomInt(2000, 3000));

      item.click();

      await delay(getRandomInt(2000, 3000));

      heartsCollecting();

      console.log('Закінчили роботу з елементом', item);
    }

    console.log('Усі серця зібрані.');

    callback();
  }

  async function clickClaimDailyButton(callback) {
		const aside = document.querySelector('aside.size-full');

    if (aside && aside.innerText.toLocaleLowerCase().includes("everyday reward")) {
      const claimButton = aside.querySelector('button.btn-primary');

      if (claimButton && claimButton.innerText.toLocaleLowerCase().includes("claim")) {
        await delay(getRandomInt(2000, 3000));
        claimButton.click();
        console.log("Claim button clicked.");
        await delay(getRandomInt(3500, 5000));
      } else {
        console.log("Claim button not found.");
      }
    } else {
        console.log("Aside with 'Everyday reward' not found.");
    }

    callback();
	}

  async function claimGift(callback) {
    await delay(getRandomInt(1000, 2000));

    const giftImg = document.querySelector("[src*='/img/listing/token-available']");
    if (giftImg) {
      giftImg.click();
    } else {
      console.log("Gift not available.");
      callback();
      return;
    }

    await delay(getRandomInt(2000, 3000));

    const collectButton = document.querySelector('aside.size-full button.btn-primary');
    if (collectButton) {
      collectButton.click();
    } else {
      console.log("Collect button not found.");
    }

    await delay(getRandomInt(500, 1000));

    const closeOverlay = document.querySelector('aside.size-full .fixed.inset-0.h-screen');
    if (closeOverlay) {
      closeOverlay.click();
    }

    callback();
  }

  async function watchAds(callback) {
    await delay(getRandomInt(1000, 2000));

    const tasksBtn = document.querySelector("[href='/tasks']");
    if (tasksBtn) {
      tasksBtn.click()
    } else {
      console.log("Tasks link doesn't found.");
      callback();
      return;
    }

    await delay(getRandomInt(1000, 2000));

    const adsSection = document.querySelector(".vads-tasks-wrapper")
    if (adsSection) {
      adsSection.scrollIntoView();

      const watchButton = adsSection.querySelectorAll('button.btn-default:not(:disabled)')[0];
      if (watchButton) {
        watchButton.click()
        waitForElm('.vads-tasks-wrapper button.btn-primary').then((elm) => {
          console.log('Element is ready');
          console.log(elm.textContent);
        });
      } else {
        console.log("All Watch buttons is disabled.");
        callback();
        return;
      }
    } else {
      console.log("ADS not found found.");
      callback();
      return;
    }

    console.log("Done watching ADS.");

    callback();
  }

  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes.length) {
        mutation.addedNodes.forEach(async function(node) {
          if (node.nodeType === 1 && node.id === 'duck-view') {
            observer.disconnect();
            await new Promise((resolve) => {
              clickClaimDailyButton(resolve);
            });

            await new Promise((resolve) => {
              claimGift(resolve);
            });

            await new Promise((resolve) => {
              feedDucks(resolve);
            });

            await new Promise((resolve) => {
              collectHearts(resolve);
            });

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
            document.body.appendChild(finishBanner);
	        }
        });
      }
    });
  });

  observer.observe(document.body, { childList: true, subtree: true })
})();
