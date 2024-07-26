// ==UserScript==
// @name        DotCoin clicker
// @namespace   Violentmonkey Scripts
// @match       https://dot.dapplab.xyz/*
// @grant       none
// @version     1.0
// @author      sunri5e
// ==/UserScript==

function getRandomMs(base, max) {
    return base + Math.floor(Math.random() * max);
}

function tap(element) {
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
    const clickerCoin = document.querySelector('.ClickerCoin');
    const clickerCoinDot = document.querySelector('.ClickerCoinDot');
    const scoreBarInfoLimit = document.querySelector('.ScoreBarInfoLimit');

    if (!clickerCoin || !clickerCoinDot || !scoreBarInfoLimit) {
        console.error('Required elements not found!');
        return;
    }

    let countdown = 25;
    let tappingInterval;
    let tappingConditionInterval;

    function startCountdown() {
        const countdownInterval = setInterval(() => {
            countdown--;
            if (countdown <= 0) {
                clearInterval(countdownInterval);
                clearInterval(tappingConditionInterval);
                clearInterval(tappingInterval);
                tapFrequently();
            }
        }, 1000);
    }

    function tapFrequently() {
        tappingInterval = setInterval(() => {
            tap(clickerCoin);
        }, getRandomMs(200, 100));
    }

    function tapWithCondition() {
        tappingConditionInterval = setInterval(() => {
            const width = parseInt(clickerCoinDot.style.width);
            if (width >= 180 && width < 200) {
                tap(clickerCoin);
                clearInterval(tappingInterval);
                tappingInterval = setInterval(() => {
                    tap(clickerCoin);
                }, getRandomMs(500, 200));
            } else if (width < 180) {
                clearInterval(tappingConditionInterval);
                tapFrequently();
            }
        }, 200);
    }

    function startCycle() {
        if (parseInt(scoreBarInfoLimit.textContent) > 0) {
            setTimeout(() => {
                tapFrequently();
                startCountdown();
                tapWithCondition();
            }, 3000);
        }
    }

    startCycle();
}

const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
            mutation.addedNodes.forEach((node) => {
                if (node.classList && node.classList.contains('PageMain')) {
                    observer.disconnect();
                    startTapping();
                }
            });
        }
    });
});

observer.observe(document.body, { childList: true, subtree: true });
