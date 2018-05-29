import { Base64 } from '../../../utils/urlsafe-base64';

Page({
  data: { // 参与页面渲染的数据
  	imgUrl:''
  },
  onLoad: function (options) {
    const _options = JSON.parse(Base64.decode(options.qrCode))
    console.log(options.qrCode)
    this.setData({
      imgUrl:_options
    })
  }
})