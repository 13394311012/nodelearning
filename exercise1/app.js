var sa = require('superagent');
var cheerio = require('cheerio');
var eventproxy = require('eventproxy');

var targetSite='https://cnodejs.org/';
var url = require('url');
var dataJson=[];
sa.get(targetSite)
  .end(function(err, resp){
	var urlsArr = [];
	$ = cheerio.load(resp.text);
	$('#topic_list .topic_title').each(function(i,elem){
		var _this = $(elem);
		urlsArr.push(
			url.resolve(targetSite,_this.attr('href'))
		);
	});
	var ep = new eventproxy();
	ep.after('getSubInfo',urlsArr.length,function(dataList){
		dataList.forEach(function(item, index, arr){
			$ = cheerio.load(item);
			console.log(
				'title:'+$('title').text()
			);
			//dataJson.push
		});
	});

	urlsArr.forEach(function(item, index, arr){
		var time=index*100;
		setTimeout(function(){
			sa.get(item).end(function(err, subres){
			ep.emit('getSubInfo',subres.text);
		});
		},time);
		
	})
	

});


/* var eventproxy = require('eventproxy');
var superagent = require('superagent');
var cheerio = require('cheerio');
var url = require('url');

var cnodeUrl = 'https://cnodejs.org/';

superagent.get(cnodeUrl)
  .end(function (err, res) {
    if (err) {
      return console.error(err);
    }
    var topicUrls = [];
    var $ = cheerio.load(res.text);
    $('#topic_list .topic_title').each(function (idx, element) {
      var $element = $(element);
      var href = url.resolve(cnodeUrl, $element.attr('href'));
      topicUrls.push(href);
    });

    var ep = new eventproxy();

    ep.after('topic_html', topicUrls.length, function (topics) {
      topics = topics.map(function (topicPair) {
        var topicUrl = topicPair[0];
        var topicHtml = topicPair[1];
        var $ = cheerio.load(topicHtml);
        return ({
          title: $('.topic_full_title').text().trim(),
          href: topicUrl,
          comment1: $('.reply_content').eq(0).text().trim(),
        });
      });

      console.log('final:');
      console.log(topics);
    });

    topicUrls.forEach(function (topicUrl) {
      superagent.get(topicUrl)
        .end(function (err, res) {
          console.log('fetch ' + topicUrl + ' successful');
          ep.emit('topic_html', [topicUrl, res.text]);
        });
    });
  }); */