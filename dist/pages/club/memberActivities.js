// pages/club/memberActivities.js

import * as clubService from '../../services/club-service';
import * as appConfig from '../../app-config';
import * as AuthService from '../../services/auth-service';
import * as clubdata from '../../utils/clubdata-format';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeFlag:"",
    emptyText: '暂无活动',
    emptyIcon: '../../images/bg_img/no_data.png',
    clubList: [],
    clubListPageIndex: 1,
    hasPrice:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      activeFlag: options.activeFlag
    })
    // console.log(options.activeFlag)
    this.getClubList(options.activeFlag);

  },
  onShow: function(){
    
  },
  // 上拉触底 加载
  onReachBottom: function (options) {
    console.log('到底啦！！');

    var clubListPageIndex = this.data.clubListPageIndex;
    clubListPageIndex++;
    this.setData({
      clubListPageIndex: clubListPageIndex
    })
    console.log(this.data.activeFlag)
    this.getClubList(this.data.activeFlag);
  },
  // 查询推荐活动
  getClubList(activeFlag) {
    // clubService.quaryClubSoldList(this.data.clubListPageIndex,activeFlag).then((result) => {
      // this.priceControl(result);
      // this.setData({
      //   clubList: clubdata.formatClubList(result.result, this.data.clubList)
      // })
      // console.log(' out .... ' + JSON.stringify(this.data.clubList));
    //   console.log(result)
    // }).catch((error) => {
    //   console.log(error);
    // })
    var _this=this
    wx.request({
      url:appConfig.apiBase+'/yp-xcx-getActiveList',
      data:{
        "custName": appConfig.custName,
        "gym": AuthService.getMemberInfo().gym,
        "memId": AuthService.getMemberInfo().memId,
        "pageNum": this.data.clubListPageIndex,
        "activeFlag": activeFlag
      },
      success:function(res){
        console.log(res.data.buyCardActiveList)
        if (_this.data.activeFlag == 0) {    
          _this.priceControl(res.data.buyCardActiveList) 
          _this.setData({
            clubList: clubdata.formatClubList0(res.data.buyCardActiveList,_this.data.clubList),
            hasPrice:true
          })
          wx.setNavigationBarTitle({
            title:"限时活动"
          })
        }else{
          _this.setData({
            clubList: clubdata.formatClubList1(res.data.memActiveList,_this.data.clubList),
            hasPrice:false
          })
          wx.setNavigationBarTitle({
            title:"会员活动"
          })

        }
      }
    })
  },
  //价格字符串修改 单位元
  priceControl(res){ 
    res.forEach(item=>{
      item.cards.act_price=item.cards.act_price.slice(0,-2);
      item.cards.price=item.cards.price.slice(0,-2);
    })
    // console.log(priceArr,actPriceArr)
    // this.data.clubList.splice(-2,1,priceArr)
  },

  bindClubCellTap(e) {
    wx.navigateTo({
      url: 'memberActivitiesDetails?activeId=' + e.currentTarget.id,
    })
  }
})