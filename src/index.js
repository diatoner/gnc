const { URL } = require('url');

const blessed = require('blessed');

const request = require('./request.js');

process.title = 'gnc';

welcomeMessage = `
  Welcome to the Gemini Node Client!

  You're currently surfing: see {blue-bg} SURF {/} in the bottom right?

  Here's how to roam the Geminispace (make sure to scroll down!):

      {bold}{underline}ALL MODES{/}

  C-c      Exit

      {blue-bg} SURF {/} {bold}{underline}MODE{/}

  Enter    Retrieve URL
  Escape   Go to READ mode
  C-d      Exit
  
      {green-bg} READ {/} {bold}{underline}MODE{/}

  k        Scroll up
  j        Scroll down
  C-u      Page up
  C-d      Page down
  Enter    Go to SURF mode
  i        Go to SURF mode
  q        Exit
  Escape   Exit

  Enjoy your stay!\r\n`;

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

let currentURL = new URL('gemini://gemini.circumlunar.space/');


const urlInput = blessed.textbox({
  parent: screen,
  height: 1,
  bottom: 0,
  width: '100%-10',
  keys: true,
  value: currentURL.href,
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


urlInput.on('focus', () => {
  modeIndicator.setContent('{right}{blue-bg} SURF {/}');
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

urlInput.key(['C-c', 'C-d'], () => screen.destroy());
screen.key(['C-c', 'q', 'escape'], () => screen.destroy());

urlInput.on('submit', () => {

  request(new URL(urlInput.value))
    .then((res) => {
      activePage.setContent('\r\n' + res.body.toString());
      activePage.setLabel(`{bold} GNC: {green-fg}${urlInput.value}{/}{bold} {/}`);
      screen.render();
    })
    .catch((err) => {

      activePage.setLabel(`{bold} GNC: {/}{bold}{red-fg}${urlInput.value}{/} `);

      if (err.header) {
        const content = [
          ``,
          `Looks like the server didn't like our request! Here's what it said:`,
          ``,
          `{bold}${err.header.status.code}{/}\t{underline}${err.header.status.message}{/}`,
          ``,
          `${err.header.status.description}`,
          ``,
          `{bold}{underline}Additional information{/}`,
          ``,
          `${err.header.meta}`,
        ].join('\n');
        activePage.setContent(content);
      } else if (err.errno) {
        const content = [
          ``,
          `Looks like we had trouble starting a connection! Here's the NodeJS error:`,
          ``,
          `{bold}${err.errno}{/}\t{underline}${err.code}{/}`,
          ``,
          `{bold}{underline}Additional information{/}`,
          ``,
          `${err}`,
          ``,
          ``,
          ``,
          `{bold}... Are you sure the URL is correct?{/}`,
        ].join('\n');
        activePage.setContent(content);
      }

      screen.render();
    });

});

urlInput.focus();
screen.render();
