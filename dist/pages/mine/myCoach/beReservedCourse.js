import moment from '../../../utils/npm/moment';
import * as mineService from '../../../services/mine-service';
import * as mineFormat from '../../../utils/minedata-format';
import { Base64 } from '../../../utils/urlsafe-base64';

Page({
  data: { // 参与页面渲染的数据
    userInfo: null,
    League:false,
    Private:false,
    PrivateCourse:[],
    LeagueCourse:[],
    ptName:'',
    today:'',
    toggleCourse:0
  },
  onLoad: function () {
    let today = moment().add(0, 'days').format('YYYY-MM-DD')
    this.setData({
    	today:moment().add(0, 'days').format('MM-DD')
    })
    this.courseList(today)
  },
  //获取私课
  getPrivateCourse(chosenDate){
  	var PrivateCourse = []
  	mineService.getPtPrivateCourse(chosenDate).then(result=>{
  		console.log(result)
  		mineFormat.formatgetPrivateCourse(result.orderList).forEach(item=>{
  			PrivateCourse.push({
  				start_time:item.start_time.split(' ')[1].split(':')[0],
  				end_time:item.end_time.split(' ')[1].split(':')[0],
  				flag:item.flag,
  				// id:item.id
          user_card_id:item.user_card_id,
          class_name:item.card_name,
          mem_name:item.mem_name,
          mem_id:item.mem_id,
          class_id:item.class_id
  			})
  		})
  		this.setData({
  			PrivateCourse:PrivateCourse
  		})
  	}).catch(error=>{
  		console.log(error)
  	})
  },
  //获取团课
  getLeagueCourse(chosenDate){
  	mineService.getPtLeagueCourse(chosenDate).then(result=>{
  		// console.log(result.orderList)
  		this.setData({
  			LeagueCourse:mineFormat.formatgetLeagueCourse(result.orderList)
  		})
  	}).catch(error=>{
  		console.log(error)
  	})
  },
  //获取教练信息
  getPtName(){
  	mineService.getPtName().then(result=>{
  		this.setData({
  			ptName:result.orderList[0].ptName
  		})
  	}).catch(error=>{
  		console.log(error)
  	})
  },
  //保存课程信息
  courseList(chosenDate){
  	this.getPrivateCourse(chosenDate)
    this.getLeagueCourse(chosenDate)
    this.getPtName()
  },
  //课程切换
  bindChoseLeagueCourse(e){
  	this.setData({
  		toggleCourse:e.currentTarget.dataset.num,
  		League:false,
  		Private:true
  	})
  },
  bindChosePrivateCourse(e){
  	this.setData({
  		toggleCourse:e.currentTarget.dataset.num,
  		League:true,
  		Private:false
  	})
  },
  bindChoseAllCourse(e){
  	this.setData({
  		toggleCourse:e.currentTarget.dataset.num,
  		League:false,
  		Private:false
  	})
  },
  getQcCode(e){
    let id = e.currentTarget.dataset.id?e.currentTarget.dataset.id:e.currentTarget.dataset.class
    let mem_id = e.currentTarget.dataset.mem?'_'+e.currentTarget.dataset.mem:''
    let user_card_id = e.currentTarget.dataset.user?'_'+e.currentTarget.dataset.user:''
    let flag = '_'+e.currentTarget.dataset.flag
    mineService.getQcCode(id,mem_id,user_card_id,flag).then(result=>{
      console.log(result)
      var qrCode = Base64.encodeURI(JSON.stringify(result.path));
      wx.navigateTo({
        url:"qrCode?qrCode="+qrCode
      })
    }).catch(error=>{
      console.log(error)
    })
  }
})