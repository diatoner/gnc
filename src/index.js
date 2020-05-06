const { URL } = require('url');

const blessed = require('blessed');

const request = require('./request.js');
const { welcomeMessage, buildErrorMessage } = require('./messages.js');

// UI setup
const screen = blessed.screen({ smartCSR: true });

const activePage = screen.data.main = blessed.box({
  parent: screen,
  border: 'line',
  tags: true,
  content: welcomeMessage,
  height: '100%-1',
  scrollable: true,
  scrollbar: true,
  label: '{bold} GNC: {yellow-fg}Good to see you!{/}{bold} {/}',
});

const urlInput = blessed.textbox({
  parent: screen,
  height: 1,
  bottom: 0,
  width: '100%-10',
  keys: true,
  tags: true,
  value: 'gemini://gemini.circumlunar.space/',
  inputOnFocus: true,
});

const modeIndicator = blessed.box({
  parent: screen,
  width: 10,
  right: 0,
  height: 1,
  bottom: 0,
  tags: true,
});

// Mode switching

urlInput.on('focus', () => {
  modeIndicator.setContent('{right}{blue-bg} SURF {/}');
  urlInput.setValue(blessed.cleanTags(urlInput.value));
  screen.render();
});

urlInput.on('blur', () => {
  modeIndicator.setContent('{right}{green-bg} READ {/}');
  screen.render();
});

screen.key(['enter', 'i'], () => {
  if (!urlInput.focused) urlInput.focus();
});

// Scrolling

const lineStack = [];

screen.key(['j'], () => {
  if (activePage.getScreenLines().length > activePage.height) {
    lineStack.push(activePage.getLine(0));
    activePage.deleteTop();
    screen.render();
  }
});

screen.key(['k'], () => {
  if (lineStack.length) {
    const l = lineStack.pop();
    activePage.unshiftLine([l]);
    screen.render();
  }
});

screen.key(['C-u'], () => {
  for (let i = 0; i < Math.floor(activePage.height / 2); i++) {
    if (lineStack.length) {
      const l = lineStack.pop();
      activePage.unshiftLine([l]);
    }
  }
  screen.render();
});

screen.key(['C-d'], () => {
  for (let i = 0; i < Math.floor(activePage.height / 2); i++) {
    if (activePage.getScreenLines().length > activePage.height) {
      lineStack.push(activePage.getLine(0));
      activePage.deleteTop();
    }
  }
  screen.render();
});

// Exiting the application

urlInput.key(['C-c', 'C-d'], () => screen.destroy());
screen.key(['C-c', 'q', 'escape'], () => screen.destroy());

// URL navigation

const history = (() => {
  const stack = [];
  let idx = 0;
  const push = (x) => {
    if (!stack.length) stack.push(x);
    if (!idx && stack[stack.length-1] !== x) stack.push(x);
    if (idx) stack.splice(-idx, idx, x);
    idx = 0;
  };
  const back = () => { if (idx < stack.length-1) { idx++; return true } };
  const forward = () => { if (idx > 0) { idx--; return true } };
  const currentValue = () => stack.length && stack[stack.length-1-idx];
  return { push, back, forward, stack, currentValue };
})();

function requestPageAt(targetUrl) {
  urlInput.setValue(`{blink}{yellow-fg}${targetUrl}{/}`);
  screen.render();

  return request(new URL(targetUrl))
    .then((res) => {
      activePage.setContent('\r\n' + res.body.toString());
      activePage.setLabel(`{bold} GNC: {green-fg}${targetUrl}{/}{bold} {/}`);
      urlInput.setValue(`{green-fg}${targetUrl}{/}`);
      screen.render();
    })
    .catch((err) => {
      activePage.setLabel(`{bold} GNC: {/}{bold}{red-fg}${targetUrl}{/} `);
      activePage.setContent(buildErrorMessage(err));
      urlInput.setValue(`{red-fg}${targetUrl}{/}`);
      screen.render();
    });
}

urlInput.on('submit', () => {
  const targetUrl = urlInput.value;
  requestPageAt(targetUrl)
    .then(() => history.push(targetUrl));
});
screen.key(['h'], () => history.back() && requestPageAt(history.currentValue()));
screen.key(['l'], () => history.forward() && requestPageAt(history.currentValue()));

// And away we go...

urlInput.focus();
screen.render();
