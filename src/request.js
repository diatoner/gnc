const tls = require('tls');
const url = require('url');

const statusCodes = require('./codes.js');

/**
 * Requests content via the Gemini protocol.
 *
 * @param {url.URL} address -- Of the form URL('gemini://host.name/path')
 * @param {number} timeout -- Connection timeout, in milliseconds
 * @returns {Promise} -- Either a TimeoutError or Response
 */
async function request(address, timeout = 3000) {

  const socket = await new Promise((resolve, reject) => {
    const socket = tls.connect({
      host: address.host,
      port: 1965,
    }, () => resolve(socket));
    socket.setTimeout(timeout, () => {
      socket.destroy();
      reject('timeout');
    });
    socket.once('error', (err) => {
      reject(err);
    });
  });

  const header = new Promise((resolve, reject) => {
    socket.write(`${address.href}\r\n`, 'utf8');
    socket.once('data', (data) => {
      data = String(data);
      const code = Number(data.slice(0, 2));
      const metaRegExp = /^\d\d\s+(.+)\r\n$/;
      const matches = data.match(metaRegExp);
      const meta = matches && matches[1];
      const result = {
        status: statusCodes.filter(c => c.code === code)[0],
        meta,
      };
      if (result.status.isOk) resolve(result);
      else reject(result);
    });
  });

  try {
    await header;
  } catch (error) {
    throw { address, header: error, body: null };
  }

  const body = await new Promise((resolve, reject) => {
    let buffer = Buffer.alloc(0);
    socket.on('data', (data) => buffer = Buffer.concat([buffer, data]));
    socket.on('end', () => resolve(buffer));
  });

  return { address, header: await header, body };

};


module.exports = request;


// CLI usage
if (require.main === module) {

  const args = process.argv.slice(2);

  const address = new url.URL(args[0]);

  request(address)
    .then(console.log)
    .catch((e) => console.error(JSON.stringify(e, null, 2)));

}
