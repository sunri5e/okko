// ==UserScript==
// @name        Blum collect
// @namespace   Violentmonkey Scripts
// @match       https://telegram.blum.codes/*
// @grant       none
// @version     1.0
// @author      sunri5e
// ==/UserScript==


// Function to wait for a specified element to appear in the DOM
function waitForElement(selector, timeout = 10000) {
  return new Promise((resolve, reject) => {
    const element = document.querySelector(selector);
    if (element) {
      resolve(element);
      return;
    }

    const observer = new MutationObserver((mutations, obs) => {
      const element = document.querySelector(selector);
      if (element) {
        obs.disconnect();
        resolve(element);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    setTimeout(() => {
      observer.disconnect();
      reject(new Error(`Element ${selector} not found within ${timeout}ms`));
    }, timeout);
  });
}

// Function to wait for the first button to appear and click it, then wait for the second button to appear and click it
async function waitForAndClickButtons() {
  try {
    const firstButton = await waitForElement('.kit-fixed-wrapper.has-layout-tabs .kit-button.is-large.is-drop.is-fill.button.is-done');
    firstButton.click();

    // Wait for 2 seconds before looking for the second button
    setTimeout(async () => {
      try {
        const secondButton = await waitForElement('.kit-fixed-wrapper.has-layout-tabs .kit-button.is-large.is-primary.is-fill.button');
        secondButton.click();
      } catch (error) {
        console.error('Second button error: ' + error.message);
      }
    }, 2000);
  } catch (error) {
    console.error('First button error: ' + error.message);
  }
}

// Execute the function
waitForAndClickButtons();
