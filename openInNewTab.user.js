// ==UserScript==
// @name        Open app in new tab
// @namespace   Violentmonkey Scripts
// @match       *://prizes.gamee.com/*
// @grant       none
// @version     1.0
// @author      -
// @description 06/11/2024, 18:04:51
// ==/UserScript==

window.innerWidth = 420;
window.innerHeight = 640;


function openInNewTab(url) {
  window.open(window.location.href, '_blank').focus();
}

const newTabButton = document.createElement('button');
newTabButton.textContent = 'New tab';
newTabButton.className = 'new-tab-btn';
newTabButton.onclick = openInNewTab;

document.body.appendChild(newTabButton);

const style = document.createElement('style');
style.textContent = `
  .new-tab-btn {
    position: fixed;
    right: 5%;
    bottom: 5%;
    z-index: 9999;
    background-color: #fff000;
    border-radius: 12px;
    color: #000;
    cursor: pointer;
    font-weight: bold;
    padding: 10px 15px;
    text-align: center;
    transition: 200ms;
    box-sizing: border-box;
    border: 0;
    font-size: 16px;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
  }

  .new-tab-btn:hover {
    outline: 0;
    background: #f4e603;
    box-shadow: 0 0 0 2px rgba(0,0,0,.2), 0 3px 8px 0 rgba(0,0,0,.15);
  }
`
document.head.appendChild(style);
