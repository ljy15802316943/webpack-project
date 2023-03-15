module.exports = {
  //端口号
  port: 3000,
  
  //获取本地ip
  getLocalIP() {
    const os = require('os');
    const ifaces = os.networkInterfaces();
    let locatIp = '';
    for (let dev in ifaces) {
      if (dev === '本地连接' || dev === '以太网') {
        for (let j = 0; j < ifaces[dev].length; j++) {
          if (ifaces[dev][j].family === 'IPv4') {
            locatIp = ifaces[dev][j].address;
            break;
          }
        }
      }
    }
    return locatIp;
  }
};