// ==UserScript==
// @name        GoldMiner clicker
// @namespace   Violentmonkey Scripts
// @match       *://*.goldminer.app/*
// @grant       none
// @version     1.0
// @author      sunri5e
// ==/UserScript==

window.innerWidth = 420;
window.innerHeight = 640;

function setUserAgent(window, userAgent) {
    // Works on Firefox, Chrome, Opera and IE9+
    if (navigator.__defineGetter__) {
        navigator.__defineGetter__('userAgent', function () {
            return userAgent;
        });
    } else if (Object.defineProperty) {
        Object.defineProperty(navigator, 'userAgent', {
            get: function () {
                return userAgent;
            }
        });
    }
    // Works on Safari
    if (window.navigator.userAgent !== userAgent) {
        var userAgentProp = {
            get: function () {
                return userAgent;
            }
        };
        try {
            Object.defineProperty(window.navigator, 'userAgent', userAgentProp);
        } catch (e) {
            window.navigator = Object.create(navigator, {
                userAgent: userAgentProp
            });
        }
    }
}

var url = decodeURI(window.location.href);
var ug = url.split('ug=')[1];

setUserAgent(window, ug);

(function() {
    // Helper function to generate a random number between min and max (inclusive)
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Function to trigger a custom tap event on a specific element
    function triggerTap(element, x, y) {
        var event = new MouseEvent('pointerup', {
            bubbles: true,
            clientX: x,
            clientY: y
        });
        element.dispatchEvent(event);
    }

    // Function to start the tapping at intervals
    function startTapping() {
        console.log('Starting to tap at intervals...')
        // Get the canvas element
        var canvas = document.querySelector('canvas');
        if (!canvas) {
            console.error('Canvas element not found.');
            return;
        }

        // Coordinates to tap (example: center of the canvas)
        var rect = canvas.getBoundingClientRect();
        var x = rect.left + rect.width / 2;
        var y = rect.top + rect.height * 0.65;
        var tapCount = 0;
        var maxTaps = 40;

        // Function to tap at intervals
        function tapAtInterval() {
            // Check if the tap count has reached the maximum number of executions
            if (tapCount >= maxTaps) {
                console.log('Stopped tapping after ' + maxTaps + ' executions.');
                return;
            }
            
            console.log('Tapping at (' + x + ', ' + y + ')');
            triggerTap(canvas, x, y);

            tapCount++;

            var interval = 100 + getRandomInt(0, 200);
            setTimeout(tapAtInterval, interval);
        }

        // Start the first tap
        tapAtInterval();
    }

    // Observer to detect when the element with id="ton-connect" appears
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1 && node.id === 'ton-connect') {
                        observer.disconnect();
                        startTapping();
                    }
                });
            }
        });
    });

    // Start observing the document for added nodes
    observer.observe(document.body, { childList: true, subtree: true });
})();


