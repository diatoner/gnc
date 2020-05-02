const tls = require('tls');
const url = require('url');

const errorCodes = require('./codes.js');

async function request(address, timeout = 3000) {

  const socket = await new Promise((resolve, reject) => {
    const socket = tls.connect({
      host: address.host,
      port: address.port || 1965,
    }, () => resolve(socket));
    socket.setTimeout(timeout, () => {
      socket.destroy();
      reject('timeout');
    });
  });

  const header = new Promise((resolve, reject) => {
    socket.write(`${address.href}\r\n`, 'utf8');
    socket.once('data', (data) => {
      data = String(data);
      const statusCode = data.slice(0, 2);
      const metaRegExp = /^\d\d\s+(.+)\r\n$/;
      const matches = data.match(metaRegExp);
      const meta = matches && matches[1];
      const result = {
        statusCode,
        meta,
      };
      if (statusCode[0] !== '2') reject(result);
      else resolve(result);
    });
  });

  try {
    await header;
    const body = await new Promise((resolve, reject) => {
      let buffer = Buffer.alloc(0);
      socket.on('data', (data) => buffer = Buffer.concat([buffer, data]));
      socket.on('end', () => resolve(buffer));
    });
    return { address, header: await header, body };
  } catch (error) {
    if (error.statusCode[0] === '3') {
      const redirectAddress = new url.URL(error.meta);
      return request(redirectAddress);
    }
    throw error;
  }

};


module.exports = request;


if (require.main === module) {

  const args = process.argv.slice(2);

  if (!args.length) {
    console.error('No URL specified!');
    process.exit(-1);
  }

  const address = new url.URL(args[0]);

  request(address)
    .then((response) => {
      if (response.header.meta.indexOf('text') !== -1) {
        console.log(response.body.toString());
      }
    })
    .catch((error) => {
      if (error.statusCode) {
        const relevantCode = errorCodes.filter(c => c.code === error.statusCode)[0];
        console.error(relevantCode.code, relevantCode.message);
        console.error(relevantCode.description.split('\n').join(' ').split('\t').join(' '));
        return;
      }
      console.error(error);
    });

}
