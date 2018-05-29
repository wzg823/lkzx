// pages/club/clubDynamicsDetail.js

import * as clubService from '../../services/club-service';
import * as clubdata from '../../utils/clubdata-format';

var WxParse = require('../../wxParse/wxParse.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    article: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    
    clubService.queryClubArticleDetail(options.articleId).then((result) => {
      this.setData({
        article: clubdata.formatClubDynamicsListDetail(result.result)
      })
      var text = result.result.content;
      var that = this;
      WxParse.wxParse('text', 'html', text, that, 5);
      console.log(result.result)
    }).catch((error) => {
      console.log(error);
    })

  },

  bindGoodSelectedTap (e) {
    var article = this.data.article;

    if (article.isGoodSelected == false) {
      article.goodNum = article.goodNum + 1;
    } else {
      article.goodNum = article.goodNum - 1;
    }

    article.isGoodSelected = !article.isGoodSelected;

    this.setData({
      article: article
    })
  }
})