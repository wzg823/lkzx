// pages/mine/myCoach/myCoachListView.js

import * as mineService from '../../../services/mine-service';
import moment from '../../../utils/npm/moment';


Page({
  data: {
    rightItemHidden: true,
    yItems: [
      {
        iconUrl: '../../../images/icon/mine/member_registration_blue.png',
        name: '会员登记',
        navigateUrl: 'registerCustomers'
      },
      {
        iconUrl: '../../../images/icon/mine/customer_track.png',
        name: '客户跟踪',
        navigateUrl: '../myMember/customerTracking?memIdentity=pt'
      },
      {
        iconUrl: '../../../images/icon/mine/transfer.png',
        name: '资料移交',
        navigateUrl: '../infoTransfer?memIdentity=pt'
      },
      {
        iconUrl: '../../../images/icon/mine/private.png',
        name: '私教会员',
        navigateUrl: 'privateMember'
      },
      {
        iconUrl: '../../../images/icon/mine/lesson.png',
        name: '被预约的课',
        navigateUrl: 'beReservedCourse'
      },
      {
        iconUrl: '../../../images/icon/mine/schedule.png',
        name: '私教排课',
        navigateUrl: 'courseArrange'
      },
    ],
    _date:1, 
    leagueClassNum:"",
    leagueClassSign:""
  },
  onLoad: function (options) {
    let chosenDate = moment().add(0, 'days').format('YYYY-MM-DD')
    console.log(chosenDate)
    this.getLeagueClass(chosenDate)
  },
  //获取团课信息
  getLeagueClass(chosenDate){
    mineService.queryLeagueClass(chosenDate).then((result)=>{
      console.log(result)
      this.setData({
        leagueClassNum:result.orderCount,
        leagueClassSign:result.signInCount
      })
    }).catch((error)=>{
      console.log(error);
    })
  },
  //跳转
  bindNavigateTap (e) {
    wx.navigateTo({
      url: e.currentTarget.id,
    })
  },
  //点击切换日期
  changeDate: function (e) { 
    console.log(e.target.dataset.num) 
    let _date = e.target.dataset.num
    let chosenDate
    if (_date == 1) {
      chosenDate = moment().add(0, 'days').format('YYYY-MM-DD')
      this.getLeagueClass(chosenDate)
    }else{
      chosenDate = moment().add(-1, 'days').format('YYYY-MM-DD')
      this.getLeagueClass(chosenDate)
    }
    this.setData({ 
      _date: _date
    }) 
  }
})