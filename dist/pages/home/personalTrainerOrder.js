// pages/home/personalTrainer.js
import moment from '../../utils/npm/moment';
import * as mineService from '../../services/mine-service';
import { Base64 } from '../../utils/urlsafe-base64';
import * as homedata from '../../utils/homedata-format';

Page({
  data: {
    headImg:'',
    coachName:'',
    ptId:'',
    week:[
      {date: ''},{date: ''},{date: ''},{date: ''},{date: ''},{date: ''},{date: ''}
    ],
    timesList:[],
    _today:"",
    _time:"",
    lastChoseTime:[]
  },
  onLoad: function (options) {
    let _options=JSON.parse(Base64.decode(options.order))
    this.initNewDate()
    var today=moment().add(0,'days').format('YYYY-MM-DD')
    this.getMyPriTime(_options.pt,today)
    this.setData({
      headImg:_options.img,
      coachName:_options.name,
      ptId:_options.pt,
      user_card_id:_options.card
    })
  },
  //初始化日期
  initNewDate(){
    var week=this.data.week
    var WEEKFORMAT = {
      '1': '一','2': '二','3': '三','4': '四','5': '五','6': '六','0': '日'
    }
    for (var i=0 ; i<7; i++) {
      week[i].date = moment().add(i, 'days').format('D')
      week[i].detail = moment().add(i, 'days').format('YYYY-MM-DD')
      week[i].name=WEEKFORMAT[moment().add(i, 'days').day()]
    }
    this.setData({
      week:week
    })
  },
  //根据日期获取教练的时间
  getMyPriTime(ptId,chosenDate){
    mineService.queryMyPriTime(ptId,chosenDate).then((result)=>{
      console.log(result)
      var timesList = this.data.timesList
      var defaultChoseTime=[]
      var lastChoseTime=this.data.lastChoseTime
      homedata.formatCoachTime(result.priOrderList).forEach(item=>{
        let start_time=item.startTime.split(':')
        let end_time=item.endTime.split(":")
        let defaultStartTime=item.reserveFlag?"":item.startTime
        let defaultEndTime=item.reserveFlag?"":item.endTime
        let defaultId=item.reserveFlag?"":item.id
        defaultChoseTime.push({
          startTime:defaultStartTime.substring(0,5),
          endTime:defaultEndTime.substring(0,5),
          id:defaultId
        })

        timesList.push({
          start_time:start_time[0],
          end_time:end_time[0],
          reserveFlag:item.reserveFlag,
          id:item.id
        })
      })
      //加载后保存默认日期和时间
        lastChoseTime.push({
          time:defaultChoseTime[0].startTime+'-'+defaultChoseTime[0].endTime,
          date:chosenDate,
          id:defaultChoseTime[0].id
        })
      this.setData({
        timesList:timesList,
        lastChoseTime:lastChoseTime
      })
    }).catch((error)=>{
      console.log(error)
    })
  },
  //选择日期
  bindChoseDay(e){
    this.setData({
      timesList:[]
    })
    console.log(e.currentTarget.dataset)
    let _today = e.currentTarget.dataset.num
    let ptId = this.data.ptId
    this.getMyPriTime(ptId,e.currentTarget.dataset.detail)
    this.setData({
      _today:_today,
      'lastChoseTime[0].date':e.currentTarget.dataset.detail
    })
  },
  //选择时间
  bindChoseTime(e){
    console.log(e.currentTarget.dataset.id)
    let _time = e.currentTarget.dataset.num
    this.setData({
      _time:_time,
      'lastChoseTime[0].time':e.currentTarget.dataset.time,
      'lastChoseTime[0].id':e.currentTarget.dataset.id
    })
  },
  //确认提交
  bindConfirm(e){
    let lastChoseTime = this.data.lastChoseTime
    console.log(lastChoseTime.length)
    if (lastChoseTime.length > 0) {
      let chosenDate = this.data.lastChoseTime[0].date
      let timeRange = this.data.lastChoseTime[0].time
      let id = this.data.lastChoseTime[0].id
      mineService.uploadMyPriOrderTime(this.data.ptId,chosenDate,timeRange,id,this.data.user_card_id).then(result=>{
        console.log(result)
        wx.showToast({
          icon:'success',
          title:'约课成功',
          duration:2000
        })
      }).catch(error=>{
        console.log(error)
      })

      setTimeout(function(){
        wx.navigateBack()
      },2000)
    }else{
      wx.navigateBack()
    }
  }
})