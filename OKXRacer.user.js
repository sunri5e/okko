// ==UserScript==
// @name        OKX Racer autoplay
// @namespace   Violentmonkey Scripts
// @match       *://*.okx.com/*
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
