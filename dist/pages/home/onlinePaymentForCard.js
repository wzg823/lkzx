// pages/home/online.js

import * as homedata from '../../utils/homedata-format';
import * as homeService from '../../services/home-service';
import * as wxPayService from '../../services/wxpay-service';
import { Base64 } from '../../utils/urlsafe-base64';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardInfo: {},
    cardId: '',
    cardPrice: '',
    activeRecId:"",
    // 是否支付成功
    isSuccessPayment: false,
    actId:"",
    actCard: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // let cardId=JSON.parse(Base64.decode(options.cards)).prj_id;
    // let cardPrice=JSON.parse(Base64.decode(options.cards)).price;
    // let actCard=JSON.parse(Base64.decode(options.cards)).actCard;
    const _options = JSON.parse(Base64.decode(options.cards))
    console.log(_options)
    if (_options.prj_id) {
      this.setData({
      // cardId: _options.cardid ? _options.cardid : '',
      cardId: _options.prj_id ? _options.prj_id : '',
      cardPrice: _options.act_price ? _options.act_price : 0,
      actCard: _options ? JSON.parse(Base64.decode(options.cards)) : null,
      actId:_options.act_id
    })
      this.getUploadOnlineCard();
    }else{
      this.setData({
      // cardId: _options.cardid ? _options.cardid : '',
      cardId: _options.cardId ? _options.cardId : '',
      cardPrice: _options.carPrice ? _options.carPrice : 0,
      actCard: _options ? JSON.parse(Base64.decode(options.cards)) : null,
      // actId:_options.act_id
    })
      this.getUploadOnlineCardList()
    }
    // this.setData({
    //   // cardId: _options.cardid ? _options.cardid : '',
    //   cardId: _options.prj_id ? _options.prj_id : '',
    //   cardPrice: _options.price ? _options.price : 0,
    //   actCard: _options.cards ? JSON.parse(Base64.decode(options.cards)) : null,
    // })
    // if (this.data.actCard != null) {
    //   if (this.data.actCard.cardType == '005' || this.data.actCard.cardType == '006') {
    //     // 一种是走的 购买课程
    //     this.getUploadOnlineClass();
    //   } else {
        // 一种是走的 购买卡
        // this.getUploadOnlineCard();
    //   } 
    // } else {
      // this.getUploadOnlineCard();
    // }

  },
  getUploadOnlineCard() {
    var newDic = {};
    newDic.cardId = this.data.cardId;
    newDic.fee = this.data.cardPrice ;
    if (this.data.actCard != null) {
      newDic.actId = this.data.actId;
      newDic.cardId = this.data.cardId;
      // newDic.fee = this.data.actPrice ;
    }
    console.log(newDic)
    wxPayService.uploadOnlineCardOrder(newDic).then((result) => {
      console.log(result.returnResult)
      console.log(result)
      this.setData({
        cardInfo: homedata.formatOnlinePaymentForCard(result.returnResult),
        activeRecId: result.returnResult.activeRecId
      })

    }).catch((error) => {
      console.log(error);
    })
  },
  getUploadOnlineCardList() {
    var newDic = {};
    newDic.cardId = this.data.cardId;
    newDic.fee = this.data.cardPrice;
    if (this.data.actCard != null) {
      // newDic.actId = this.data.actId;
      newDic.cardId = this.data.cardId;
      // newDic.fee = this.data.actPrice / 100;
    }
    console.log(newDic)
    wxPayService.uploadOnlineCardOrder(newDic).then((result) => {
      console.log(result)
      this.setData({
        cardInfo: homedata.formatOnlinePaymentForCard(result.returnResult),
        activeRecId: result.returnResult.activeRecId
      })

    }).catch((error) => {
      console.log(error);
    })
  },

  // 页面卸载
  onUnload: function () {
    // Do something when page close.
    // 如果支付失败/返回前一页面 则要调用 支付失败接口

    if (!this.data.isSuccessPayment) {

      var payInfo = {
        userCardId: this.data.cardInfo.userCardId,
        xcxOrderId: this.data.cardInfo.orderId,
        activeRecId: this.data.activeRecId
      }
      
      wxPayService.uploadFailPayment(payInfo).then((result) => {

        console.log('uploadFailPayment *** ' + JSON.stringify(result));

      }).catch((error) => {
        console.log(error);
      })
    }


  },
  
  // 定金抵扣
  bindVouchersTap (e) {
    var index = e.currentTarget.id;
    var vouchers = this.data.cardInfo.vouchers;
    var finalPrice = 0;
    var preFeeId = '';

    vouchers.forEach(item => {
      item.checked = false;
      vouchers[index].checked = true;

      if (item.checked == true) {
        finalPrice = this.data.cardInfo.price - item.price;
        preFeeId = item.preFeeId;
      }
    })

    this.setData({
      'cardInfo.vouchers': vouchers,
      'cardInfo.finalPrice': finalPrice,
      'cardInfo.preFeeId': preFeeId
    })

  },

  bindFinalWXPayTap() {

    var payInfo = {
      userCardId: this.data.cardInfo.userCardId,
      xcxOrderId: this.data.cardInfo.orderId,
      preFeeId: this.data.cardInfo.preFeeId,
      orderPrice: this.data.cardInfo.price
    }

    // if () {

    // }

    wxPayService.makeMemCardPayment(payInfo).then((result) => {

      console.log('makeMemCardPayment *** ' + JSON.stringify(result));

      if (result) {
        this.setData({
          isSuccessPayment: true
        })
        wx.navigateBack({
          delta: 1
        })
      }

    }).catch((error) => {
      console.log(error);
    })

  }

})