import moment from '../../../utils/npm/moment';
import * as mineService from '../../../services/mine-service';
import * as minedata from '../../../utils/minedata-format';

// pages/mine/myCoach/myCoachListView.js
Page({
  data: {
    tableTr:[
      {hour:"00",isThisTime:false},{hour:"01",isThisTime:false},
      {hour:"02",isThisTime:false},{hour:"03",isThisTime:false},
      {hour:"04",isThisTime:false},{hour:"05",isThisTime:false},
      {hour:"06",isThisTime:false},{hour:"07",isThisTime:false},
      {hour:"08",isThisTime:false},{hour:"09",isThisTime:false},
      {hour:"10",isThisTime:false},{hour:"11",isThisTime:false},
      {hour:"12",isThisTime:false},{hour:"13",isThisTime:false},
      {hour:"14",isThisTime:false},{hour:"15",isThisTime:false},
      {hour:"16",isThisTime:false},{hour:"17",isThisTime:false},
      {hour:"18",isThisTime:false},{hour:"19",isThisTime:false},
      {hour:"20",isThisTime:false},{hour:"21",isThisTime:false},
      {hour:"22",isThisTime:false},{hour:"23",isThisTime:false},
    ],
    week:[
      {date: '',name: '',isThisDay:false},{date: '',name: '',isThisDay:false},
      {date: '',name: '',isThisDay:false},{date: '',name: '',isThisDay:false},
      {date: '',name: '',isThisDay:false},{date: '',name: '',isThisDay:false},
      {date: '',name: '',isThisDay:false}
    ],
    arrange:[],
    hourList:[
      '00:00-01:00','01:00-02:00','02:00-03:00','03:00-04:00','04:00-05:00',
      '05:00-06:00','06:00-07:00','07:00-08:00','08:00-09:00','09:00-10:00',
      '10:00-11:00','11:00-12:00','12:00-13:00','13:00-14:00','14:00-15:00',
      '15:00-16:00','16:00-17:00','17:00-18:00','18:00-19:00','19:00-20:00',
      '20:00-21:00','21:00-22:00','22:00-23:00','23:00-24:00','24:00-00:00',
    ],
    selectedTime:[],
    pickedTime:"",
    pickerViewHidden:true,
    courseTime:true
  },
  onLoad: function (options) {
    //初始化日期
    this.initNewDate()
    //获取课程安排
    this.courseArrange()
  },
  //初始化日期
  initNewDate(){
    var week=this.data.week
    var WEEKFORMAT = {
      '1': '周一',
      '2': '周二',
      '3': '周三',
      '4': '周四',
      '5': '周五',
      '6': '周六',
      '0': '周日'
    }
    for (var i=0 ; i<7; i++) {
      week[i].date = moment().add(i, 'days').format('D')
      week[i].detail = moment().add(i, 'days').format('YYYY-MM-DD')
      week[i].name=WEEKFORMAT[moment().add(i, 'days').day()]
    }
    this.setData({
      week:week,
      pickedTime:week[0].detail+' '+'00:00-01:00'
    })
  },
  //课程安排
  courseArrange(){
    // var arrange=this.data.arrange
    var selectedTime=this.data.selectedTime
    var _this=this
    var week=this.data.week
    var chosenDate = week[0].detail
    var arrange = this.data.arrange
    //获取课程安排 将日期拆解 
    mineService.querycourseArrange(chosenDate).then((result)=>{
      arrange=minedata.formatgetCourseArrange(result.privateOrderList)
      console.log(arrange)
      arrange.forEach(item=>{
        let time = item.startTime.split('-')
        let Time = time[2].split(' ')
        let hour = Time[1].split(':')
        let regex=/^[0]+/
        selectedTime.push({
          td:Time[0].replace(regex,""),
          tr:hour[0],
          name:item.name
      })
        
      _this.setData({
        selectedTime:selectedTime
      })
      })
    }).catch((error)=>{
      console.log(error)
    })
  },
  //获取滚动选择器内容
   bindPickerChange (e) {
    var val = e.detail.value;
    this.setPickerTextInputItemValue(val);
  },
  setPickerTextInputItemValue(val){
    var choseDate="", choseHour=""
    var hourList=this.data.hourList
    var week=this.data.week
    choseHour=hourList[val[1]]
    choseDate=week[val[0]].detail
    console.log(choseDate , choseHour)
    this.setData({
      pickedTime:choseDate+' '+choseHour
    })
  },
  // 取消 、确定、打开选择器
  bindPickerConfirmTap(e) {
    this.setData({
      pickerViewHidden: true
    })
  },
  bindPickerCancelTap () {
    this.setData({
      pickerViewHidden: true
    })
  },
  bindPickerOpenTap(){
    this.setData({
      pickerViewHidden: false
    })
  },
  //打开、取消、确定排课时间
  bindCourseOpenTap(){
    this.setData({
      courseTime: false
    })
  },
  bindCourseConfirmTap(){
    console.log(this.data.pickedTime)
    mineService.uploadCourseArrange(this.data.pickedTime).then((result)=>{
      console.log(result)
      this.courseArrange()
    }).catch((error)=>{
      console.log(error)
    })
    this.setData({
      courseTime: true
    })
  },
  bindCourseCloseTap(){
    this.setData({
      courseTime: true
    })
  },


})