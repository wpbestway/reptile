const express = require('express'),
      app = express(),
      superagent = require('superagent'),
      cheerio = require('cheerio');
let hotNews = []

app.listen(4000, function () {})
app.get('/', async (req, res, next) => {
  res.send(hotNews)
})

superagent
  .get('https://news.baidu.com/')
  .end((err, res) => {
  if (err) {
    console.log('抓取失败', err)
  } else {
    console.log('抓取成功')
    getHotNews(res.text)
    console.log(hotNews)
  }
})

let getHotNews = (html) => {
  let $ = cheerio.load(html)
  $('#pane-news li').each((idx, ele) => {
    let news = {
      text: unescape($(ele).find('a').html().replace(/&#x/g,'%u').replace(/;/g,'')),
      href: unescape($(ele).find('a').attr('href').replace(/&#x/g,'%u').replace(/;/g,''))
    }
    hotNews.push(news)
  })
}