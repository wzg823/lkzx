Page({
  data: {
    
  },
  onLoad: function(options) {
    wx.navigateToMiniProgram({
      appId: 'wxf4469b3920bc1ed2',
      path: 'pages/index/index',
      extraData: {
        tel: '123123123123'
      },
      success(res) {
        console.log(res)
      }
    })
  }
})