// ==UserScript==
// @name         Dogiators Autoclicker
// @namespace    Violentmonkey Scripts
// @match        *://*.dogiators.com/*
// @version      0.0.1
// @description  26.08.2024
// @grant        none
// ==/UserScript==

(function () {
  const logPrefix = "%c[Dogiators] ";
  const styles = {
    success:
      "background: #28a745; color: #ffffff; font-weight: bold; padding: 4px 8px; border-radius: 4px;",
    starting:
      "background: #8640ff; color: #ffffff; font-weight: bold; padding: 4px 8px; border-radius: 4px;",
    error:
      "background: #dc3545; color: #ffffff; font-weight: bold; padding: 4px 8px; border-radius: 4px;",
    info: "background: #007bff; color: #ffffff; font-weight: bold; padding: 4px 8px; border-radius: 4px;",
  };

  let settings = {
    minEnergy: 25, // Минимальная энергия, необходимая для нажатия на монету
    minInterval: 30, // Минимальный интервал между кликами в миллисекундах
    maxInterval: 100, // Максимальный интервал между кликами в миллисекундах
    minEnergyRefillDelay: 60000, // Минимальная задержка в миллисекундах для пополнения энергии (60 секунд)
    maxEnergyRefillDelay: 180000, // Максимальная задержка в миллисекундах для пополнения энергии (180 секунд)
    maxRetries: 5, // Максимальное количество попыток перед перезагрузкой страницы
    autoBuyEnabled: false, // Автопокупка по умолчанию выключена
    maxPaybackHours: 672, // Максимальное время окупаемости в часах для автопокупки (4 недели)
    isPaused: false,
  };

  let retryCount = 0;

  function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function getElementPosition(element) {
    let current_element = element;
    let top = 0,
      left = 0;
    do {
      top += current_element.offsetTop || 0;
      left += current_element.offsetLeft || 0;
      current_element = current_element.offsetParent;
    } while (current_element);
    return {
      top,
      left,
    };
  }


  function pressAndHold(element, duration, x, y) {
    if (!element) return;

    // Create a pointerdown event
    const pointerDownEvent = new PointerEvent("pointerdown", {
      bubbles: true,
      cancelable: true,
      pointerType: "touch", // Could be 'touch' or 'pen' for different devices
      clientX: x, // Simulate the position inside the element
      clientY: y,
    });

    // Dispatch the pointerdown event
    element.dispatchEvent(pointerDownEvent);

    // Hold the pointer for the specified duration, then release it
    const pointerUpEvent = new PointerEvent("pointerup", {
      bubbles: true,
      cancelable: true,
      pointerType: "touch",
      clientX: x,
      clientY: y,
    });

    // Dispatch the pointerup event
    element.dispatchEvent(pointerUpEvent);
  }

  function performRandomClick() {
    if (settings.isPaused) {
      setTimeout(performRandomClick, 1000);
      return;
    }

    const earnMoreCoinsElement = document.querySelector(
      'div.earn-top-title[style*="opacity: 1"]'
    );
    if (
      earnMoreCoinsElement &&
      earnMoreCoinsElement.textContent.trim() === "Earn more coins"
    ) {
      console.log(
        `${logPrefix}Earn more coins element found, pausing autoclicker...`,
        styles.info
      );
      setTimeout(performRandomClick, 5000);
      return;
    }

    const energyElement = document.getElementsByClassName("EnergyModule")[0];
    const buttonElement = document.getElementById("dogContainer");

    if (!energyElement || !buttonElement) {
      console.log(`${logPrefix}Element not found, retrying...`, styles.error);

      retryCount++;
      if (retryCount >= settings.maxRetries) {
        console.log(
          `${logPrefix}Max retries reached, but Earn more coins element is not present. Reloading page...`,
          styles.error
        );
        location.reload();
      } else {
        setTimeout(() => {
          setTimeout(
            performRandomClick,
            getRandomNumber(settings.minInterval, settings.maxInterval)
          );
        }, 2000);
      }
      return;
    }

    retryCount = 0;

    const energy = parseInt(
      energyElement
        .getElementsByClassName("StrokedText")[0]
        .textContent.split("/")[0]
    );
    if (energy > settings.minEnergy) {
      let { top, left } = getElementPosition(buttonElement);
      const randomX = Math.floor(
        left + Math.random() * buttonElement.offsetWidth
      );
      const randomY = Math.floor(
        top + Math.random() * buttonElement.offsetHeight
      );


      // Example usage: press and hold for 2 seconds (2000 milliseconds)
      pressAndHold(buttonElement, 2000, randomX, randomY);
    } else {
      console.log(
        `${logPrefix}Insufficient energy, pausing script for energy refill.`,
        styles.info
      );

      const randomEnergyRefillDelay = getRandomNumber(
        settings.minEnergyRefillDelay,
        settings.maxEnergyRefillDelay
      );
      const delayInSeconds = randomEnergyRefillDelay / 1000;

      console.log(
        `${logPrefix}Energy refill delay set to: ${delayInSeconds} seconds.`,
        styles.info
      );

      setTimeout(performRandomClick, randomEnergyRefillDelay);
      return;
    }
    const randomInterval = getRandomNumber(
      settings.minInterval,
      settings.maxInterval
    );
    setTimeout(performRandomClick, randomInterval);
  }

  function clickThankYouButton() {
    const thankYouButton = document.querySelector(
      ".Button.min-h-16.overflow-hidden.cursor-pointer.text-2xl.text-center.bg-gradient-to-b"
    );
    if (thankYouButton) {
      thankYouButton.click();
      console.log(`${logPrefix}'Thank you' button clicked.`);
    }
  }

  setTimeout(() => {
    console.log(`${logPrefix}Script starting after 5 seconds delay...`);
    clickThankYouButton();
    performRandomClick();
    // autoBuy();
  }, 5000);
})();
