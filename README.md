## 需求
万维网上有无数的网页，每个网页都包含着众多各种各样的信息，这些海量的信息，无孔不入，森罗万象，共同组成了我们熟i知的互联网；但我们基于数据分析或是产品需求，需要从特定网页，提取出指定信息，并将这些信息为我们所用，那么如何去设计，实现一种能打开特定网页，并从中提取出指定内容的程序，这样的程序就是爬虫；

互联网上每时每刻都运行着无数的爬虫，我们熟知的百度搜索，就是每天放出无数爬虫对全网内容进行爬取，然后将一些重点信息（何为重点信息，如何识别）保存起来，因此在使用百度时，就能搜索到对应结果；
搜索引擎的爬虫遍布互联网的各个角落，四通八达，就像是蜘蛛的网络，蜘蛛的名称就由此而来；

而作为一个网站，该怎么限制这些搜索引擎爬取，或是指定爬虫的爬取内容呢？请看robots.txt文件，演示下淘宝的robots.txt在百度和谷歌上的差异；解释下为什么淘宝这些网址不需要ｓｅｏ；

解释下seo的优化；

如果一个爬虫不按这个文件协议来，从法律上来说，这些爬虫都是违法侵犯知识产权的，都是违法的

## 原理
传统爬虫是从一个或若干个网页的URL开始，通过后端网络请求模块获取网页内容，这些网页内容就是前端写的页面代码，然后从这些代码中分析提取指定元素的内容，获取内容后保存到数据库中；在爬取网页时，不断向当前页面抽取新的URL放入队列，直至满足停止条件；

高级一些的爬虫，可以模仿真人打开浏览器（或是浏览器内核），通过浏览器获取网页内容；这样可以防止一些反爬虫机制（对于一些较高级的反爬虫机制，仍然无法做到全自动爬取）；

一个完整的爬虫一般包含三个模块：
１．网络请求模块
２．爬取流程控制模块
３．内容分析提取模块

### 网络请求
浏览器访问网页，实则是浏览器发送了一堆HTTP(S)请求，同样的，可以模仿浏览器发送http请求，获取内容，http是指超文本传输协议，是一种数据传输协议；
```js
// 通过node的request请求模块获取网页内容
const express = require('express')
const app = express()
const superagent = require('superagent')

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
    console.log('抓取成功', res.text)
  }
})
```
网络请求的前提条件
１．登录验证，只有登录后才能获取数据
２．ip限制，网址防火墙会对某个固定ip在一段时间内的请求次数做限制，如果一段时间内请求次数过多，则会拒绝请求，或是需要验证后才能请求；可查看符号留学院校库；
当然，破解该限制的方法也有，有专用的ip提供商，通过代理的方式请求数据，仍然可以达到爬取的目的；
３．交互限制，有些网页需要用户进行一些操作，才能正常进入下一步，比如输入验证码，之所以这样做，就是为了验证访问中的身份，爬虫在遇到这种验证码时，通过图像识别，可以识别出验证码，但是对于复杂的验证码，比如１２３０６，这种就需要人为去控制；
<!-- #### 深度爬取
爬虫运行时需要一个初始url,然后根据爬取到的内容，解析里面的链接url，然后继续用该url爬取新网页，就像一颗多叉树，从根节点开始，逐渐向更深的网页爬取，因此为了爬虫能够结束，一般都会设置一个爬取深度或是结束条件； -->

### 内容分析提取
提取的几个前提条件：
１．请求headers的Accept-Encoding字段表示浏览器告诉服务器自己支持的压缩算法，目前最多的是gzip，如果服务器开启了压缩，返回时会对响应体进行压缩，爬虫需要自己解压；
２．移动的大量的SPA（单页面）应用，这些应用大量运用了ajax技术，我们浏览器请求的网页内容只包含页面的框架，直接请求页面时，不包含具体的数据信息，而是通过js文件再次请求数据，然后动态生成的页面；

内容分析方式：
1.css选择器
2.XPATH元素路径
3.正则表达式匹配查找

如下演示css选择器分析提取数据：
```js
// 通过node插件cheerio.js，模仿jquery提取数据
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
```
一个初步的爬虫已经完成，但是功能依然有限，无法做到通用，还只是一个初级的小爬虫，接下来的几次分享，将对爬虫这门技术一步步深入，带大家慢慢深入到爬虫的高级用法，让大家领略技术的魅力；

