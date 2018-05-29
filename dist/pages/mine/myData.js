import moment from '../../utils/npm/moment';

Page({
  data: {
    tableBlock:['1','2','3','4','5','6','7','8','9'],
    tableStand:['1','2','3','4'],
    personData:[
    	{
    		kcal:37,
    		time:120,
    		project:20,
    		date:"04/27"
    	},
    	{
    		kcal:137,
    		time:320,
    		project:21,
    		date:"04/28"
    	},
    	{
    		kcal:237,
    		time:120,
    		project:20,
    		date:"04/29"
    	},
    	{
    		kcal:337,
    		time:120,
    		project:20,
    		date:"04/30"
    	},
    	{
    		kcal:437,
    		time:120,
    		project:20,
    		date:"05/01"
    	},
    	{
    		kcal:537,
    		time:360,
    		project:10,
    		date:"05/02"
    	},
      {
        kcal:637,
        time:20,
        project:10,
        date:"05/03"
      }
    ],
    date:"",
    time:"",
    project:"",
    kcal:"",
    i:""
  },
  onLoad: function(options) {
	var yearMonthDay = moment().add(0, 'days').format('MM/DD');
	console.log(yearMonthDay)
	var personData = this.data.personData
	// personData.current=true
	this.data.personData.forEach((item,index) => {
		if (item.date==yearMonthDay) {
			this.setData({
				date:item.date,
				time:item.time,
				project:item.project,
				kcal:item.kcal,
				i:index,
				personData:personData
			})
		}
	})
  }
  //载入数据
  //日期增加
  ,addDate(){
  	var i=this.data.i + 1
  	if (i<=6) {
	  	this.setData({
	  		i:this.data.i + 1,
	  		date:this.data.personData[i].date,
	  		time:this.data.personData[i].time,
	  		project:this.data.personData[i].project,
	  		kcal:this.data.personData[i].kcal
		})
  	}
  }
  //日期减少
  ,reduceDate(){
  	var i=this.data.i - 1
  	if (i>=0) {
  		this.setData({
  			i:this.data.i - 1,
  			date:this.data.personData[i].date,
	  		time:this.data.personData[i].time,
	  		project:this.data.personData[i].project,
	  		kcal:this.data.personData[i].kcal
  		})
  	}
  }
})