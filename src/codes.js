const fs = require('fs');

const statusCodes = JSON.parse(fs.readFileSync('./status-codes.json'));

statusCodes.forEach((status) => {
  status.isOk = status.level === 2;
});

module.exports = statusCodes;
