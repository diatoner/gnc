const tls = require('tls');

const GEMINI_PORT = 1965;
const isDebugMode = process.env.DEBUG || false;

function request(address) {

  const host = address.split('/')[0];
  const url  = `${address}`;

  console.log('Beginning request for', url);

  console.log(`Connecting to ${host}`);

  const socket = tls.connect({
    host: host,
    port: GEMINI_PORT,
    checkServerIdentity: () => undefined,
  }, () => {

    console.log(`Connection established with ${host}`);

    if (isDebugMode) {
      // FIXME: no certificate validation
      console.debug(`Negotiated cipher suite:`);
      console.debug(socket.getCipher());
      console.debug(`Peer certificate:`);
      console.debug(socket.getPeerCertificate());
    }

    const requestUrl = `gemini://${address}`;
    console.log(`Sending as utf8: ${requestUrl}<CRLF>`);
    socket.write(`${requestUrl}\r\n`, 'utf8');

    socket.once('data', (data) => {
      data = String(data);
      const statusCode = Number(data.slice(0, 2));
      const metaRegExp = /^\d\d\s+(.+)\r\n$/;
      const matches = data.match(metaRegExp);
      const meta = matches && matches[1];

      if (Math.floor(statusCode / 10) !== 2) {
        console.error(`Error: ${data}`);
        return;
      }

      console.log('\nSuccess! Receiving data...\n');

      socket.on('data', (data) => {
        console.log(String(data));
      });

    });

  });

  socket.on('end', () => console.log('Socket closed.'));

};


module.exports = request;

if (require.main === module) {

  const args = process.argv.slice(2);

  if (!args.length) {
    console.error('No URL specified!');
    process.exit(-1);
  }

  const url = args[0];

  request(url);

}
