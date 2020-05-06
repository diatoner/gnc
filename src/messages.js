const welcomeMessage = `
  Welcome to the Gemini Node Client!

  You're currently surfing: see {blue-bg} SURF {/} in the bottom right?

  Here's how to roam the Geminispace (make sure to scroll down!):

      {bold}{underline}ALL MODES{/}

  C-c      Exit

      {blue-bg} SURF {/} {bold}{underline}MODE{/}

  Enter    Retrieve URL
  C-j      Use previous URL as input
  down     Use previous URL as input
  C-k      Use next URL as input
  up       Use next URL as input
  Escape   Go to READ mode
  C-d      Exit
  
      {green-bg} READ {/} {bold}{underline}MODE{/}

  k        Scroll up
  j        Scroll down
  h        Request previous page in history
  l        Request next page in history
  C-u      Page up
  C-d      Page down
  Enter    Go to SURF mode
  i        Go to SURF mode
  q        Exit
  Escape   Exit

  Enjoy your stay!\r\n`;

function buildErrorMessage(error) {

  if (error.header)
    return buildResponseErrorMessage(error);

  if (error.errno)
    return buildRuntimeErrorMessage(error);

  return buildGenericErrorMessage(error);

};

const padWithNewlines = (arr) => '\r\n' + arr.join('\n\n');

function buildResponseErrorMessage(error) {
  return padWithNewlines([
    `Looks like the server didn't like our request! Here's what it said:`,
    `{bold}${error.header.status.code}{/}\t{underline}${error.header.status.message}{/}`,
    `${error.header.status.description}`,
    `{bold}{underline}Additional information{/}`,
    `${error.header.meta}`,
  ]);
}

function buildRuntimeErrorMessage(error) {
  return padWithNewlines([
    `Looks like we had trouble starting a connection! Here's the NodeJS error:`,
    `{bold}${error.errno}{/}\t{underline}${error.code}{/}`,
    `{bold}{underline}Additional information{/}`,
    `${error}`,
    `{bold}ENOTFOUND errors are DNS errors: we couldn't find the server you requested.{/}`,
    `{bold}Check out the NodeJS docs for more info:{/}`,
    `{bold}https://nodejs.org/dist/latest-v12.x/docs/api/dns.html#dns_dns_lookup_hostname_options_callback{/}`,
  ]);
}

function buildGenericErrorMessage(error) {
  return padWithNewlines([
    `Looks like something bad happened, and we don't know what it is:`,
    `${JSON.stringify(error, null, 2)}`,
  ]);
}

module.exports = { welcomeMessage, buildErrorMessage };
