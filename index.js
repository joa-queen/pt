// Load native UI library
var gui = require('nw.gui');

// Create a tray icon
var tray = new gui.Tray({ icon: 'img/tray.png' });

// reusing the custom tray menu (just hiding and showing)
var customTrayMenu = gui.Window.open('movies.html', {
  "title": "Search",
  "toolbar": false,
  "frame": false,
  "width": 300,
  "height": 150,
  "position": "mouse",
  "always-on-top": true,
  "visible-on-all-workspaces": true,
  "show_in_taskbar": false,
  "show": false
});

customTrayMenu.on('blur', function() {
  customTrayMenu.hide();
});

var iconWidth = 13;
var translate = require('os').platform() == 'darwin' ?
  function (pos) {
    pos.x -= Math.floor(customTrayMenu.width/2-iconWidth);
  } :
  function (pos) {
    pos.x -= Math.floor(customTrayMenu.width/2);
    pos.y -= trayAreaIsTop(pos) ? 0 : customTrayMenu.height;
  };
function trayAreaIsTop(pos) {
  var screen;
  if (gui.Screen.Init) gui.Screen.Init();
  function posInBounds(s) {
    return pos.y > s.bounds.y && pos.y < (s.bounds.y + s.bounds.height) &&
      pos.x > s.bounds.x && pos.x < (s.bounds.x + s.bounds.width);
  }
  screen = gui.Screen.screens.filter(posInBounds)[0];
  return pos.y < (screen.bounds.y + screen.bounds.height) / 2;
}
function showCustomTrayMenuAt(position) {
  translate(position);
  customTrayMenu.moveTo(position.x, position.y);
  customTrayMenu.show();
  customTrayMenu.focus();
}
tray.on('click', showCustomTrayMenuAt);
