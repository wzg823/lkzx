// pages/home/myClass.js

import * as homedata from '../../utils/homedata-format';
import * as homeService from '../../services/home-service';
import { Base64 } from '../../utils/urlsafe-base64';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    emptyText: '暂无约课',
    emptyIcon: '../../images/bg_img/no_data.png',
    user_card_id:'',
    myclassList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  
    this.getMyClass();
    // this.bindScanCode()
  },

  getMyClass() {
    
    homeService.queryMyClass().then((result) => {
      console.log(result)
      // console.log('queryMyClass *** ' + JSON.stringify(result));
      if (result.rs == 'Y') {
        this.setData({
          myclassList: homedata.formatMyClass(result.result)
        })
      }

    }).catch((error) => {
      console.log(error);
    })
  },
  bindClassStatusTap(e) {
    console.log(e.currentTarget.dataset.type)
    var orderId = e.currentTarget.dataset.orderid;
    var index = e.currentTarget.id;
    var myclassList = this.data.myclassList;
    var type = e.currentTarget.dataset.type;
    homeService.uploadCancelMyClass(orderId,type).then((result) => {

      console.log(result);
      if (result.errCode == 0) {
        myclassList[index].classStatus = '已取消';
        this.setData({
          myclassList: myclassList
        })
      } else {
        wx.showModal({
          title: '取消失败',
          content: result.errMsg,
        })
      }

    }).catch((error) => {
      console.log(error);
    })

  },

  //扫码销课
  bindScanCode(){
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        console.log(res.result.split('_'))
        let id = res.result.split('_')[0]
        let classType = res.result.split('_')[1]
        let mem_id = res.result.split('_')[2]
        var user_card_id = res.result.split('_')[3]
        homeService.uploadClassInfoQr(id,classType).then(result=>{
          console.log(result)
          if (result.errCode == 0) {
            var qrResult = Base64.encodeURI(JSON.stringify(result));
            var qrInfo = Base64.encodeURI(JSON.stringify(result));
            wx.navigateTo({
              url:'scanCode?qrInfo='+qrInfo+'_'+user_card_id+'_'+id
            })
          }
        }).catch(error=>{
          console.log(error)
        })
      }
    })
  }
  
})