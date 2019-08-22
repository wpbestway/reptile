const rp = require('request-promise')
      fs = require('fs'),
      cheerio = require('cheerio'),
      depositPath = 'D:/reptle/';
let downloadPath;

module.exports = {
  async getPage(url) {
    const data = {
      url,
      res: await rp({
        
      })
    }
  }
}
