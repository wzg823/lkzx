import { Base64 } from '../../utils/urlsafe-base64';
import * as homeService from '../../services/home-service';


Page({
  data: {
  	user_card_info:'',
  	id:'',
  	pt_name:'',
  	end_time:'',
  	start_time:'',
  	type_flag:'',
  	pt_pic_url:''
  },
  onLoad: function (options) {
	var qrInfo = JSON.parse(Base64.decode(options.qrInfo.split('_')[0]))
	console.log(qrInfo)
  	this.setData({
  		user_card_info:options.qrInfo.split('_')[1],
  		id:options.qrInfo.split('_')[2],
  		pt_name:qrInfo.pt_name,
  		end_time:qrInfo.end_time.split(' ')[1].split(':')[0],
  		start_time:qrInfo.start_time.split(' ')[1].split(':')[0],
  		type_flag:qrInfo.type_flag,
  		pt_pic_url:qrInfo.pt_pic_url
  	})
  },
  bindConfirmClassInfo(e){
  	var class_id = e.currentTarget.dataset.id
  	var type_flag = e.currentTarget.dataset.flag
  	var user_card_id = e.currentTarget.dataset.card
  	console.log(e.currentTarget.dataset)
  	homeService.uploadClassHandle(class_id,type_flag,user_card_id).then(result=>{
  		console.log(result)
  		wx.showToast({
        	title: '销课成功',
        	duration:2000,
        	mask:true,
        	icon:'success',
        	success:function(){
        		wx.navigateBack({
  					delta: 1
  				})
        	}
      	}) 
  		
  	}).catch(error=>{
  		console.log(error)
  	})
  }
})