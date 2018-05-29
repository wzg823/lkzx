
import * as homeService from '../../services/home-service';
import * as homedata from '../../utils/homedata-format';
import * as AuthService from '../../services/auth-service';

let mytimer

Page({
  data:{ 
    // 验证码 文字 和倒计时
    codeText: '',
    codeNum: 60,

    //输入框手机号
    memTelephone:"",
    telephoneCode: '',
    phoneNmu:"",

    //验证码输入框
    cerInputNum:"",

    // 是否允许再次发送验证码
    isAollowCodeTap: true,

    isCertificationMem:false,

    //是否需要发送验证码
    needVerCode:false,

    // 门店 列表
    gymList: [],
    gym: '',

    //gymchose
    gymChose:false


  },
  onLoad: function (options) {
    this.getCertifiMem();
  },
  onShow: function(options) {
      // Do something when show.
  },
  getCertifiMem() {
    if (AuthService.getMemberInfo()) {
      this.setData({
        isCertificationMem: true
      })
      // 控制 按钮显示
      console.log('*已认证会员*');
      wx.switchTab({
        url: "club",
        fail:function(res){
          console.log(res)
        }
      })
    } else {
      console.log('*未认证会员*');
      return false;
    }
  },
      // 确定认证
    confirmCertification() {
      this.setData({
        phoneNmu:this.data.memTelephone
      })
      AuthService.queryCertificationMember(this.data.phoneNmu).then((result) => {
          //输入会员手机号验证成功跳转首页
          wx.switchTab({
            url: "club",
            fail:function(res){
              console.log(res)
            }
          })
      }).catch((error) => {
        if (error.errMsg == 'request:fail') {
          console.log(2)
        } else {
          this.setData({
            needVerCode:true,
            telephoneCode:"",
            codeText: '获取验证码'
          })
        }
        console.log(error);

      })
    },
     // 确定 验证 验证码
    confirmPhoneCode() {
      homeService.uploadPhoneCode(this.data.cerInputNum, this.data.telephoneCode).then((result) => {
        this.setData({
          // isConfiGym: true,
          // isConfiCode: false
          gymChose:true
        })
        // 获取 gym list 
        this.getGYMList();

      }).catch((error) => {
        console.log(error);
      })
    },
        // 倒计时
    setTimeOutPhoneCode(that) {
      let codeNum = this.data.codeNum;

      if (codeNum == 0) {

        this.setData({
          isAollowCodeTap: true,
          codeText: '重新发送',
          codeNum: 60
        })

      } else {

        codeNum--;
        this.setData({
          isAollowCodeTap: false,
          codeText: codeNum + 's',
          codeNum: codeNum
        })
        mytimer = setTimeout(function () {
          that.setTimeOutPhoneCode(that)
        }, 1000)
      }
    },
       // 发送手机验证码
    sendCodeMessage() {
      this.setData({
        memTelephone:this.data.telephoneCode
      })
      homeService.queryPhoneCode(this.data.memTelephone).then((result) => {
        // this.setData({
        //   isConfiCode: true,
        //   cerInputNum: ''
        // })
        console.log("发送成功")
      }).catch((error) => {
        console.log(error);
      })
    },
    // 获取验证码 点击按钮
    bindGetPhoneCodeTap() {
      this.setData({
        phoneNmu:this.data.telephoneCode
      })
      if (this.data.phoneNmu != '') {
        if (this.data.isAollowCodeTap) {
          this.setTimeOutPhoneCode(this);
          this.sendCodeMessage();
        } 
      }else{
        wx.showToast({
            title: "请输入手机号",
            icon: 'none'
        })
      }
    },
    // 输入框 获取输入的 手机号
    bindCerMemInput(e) {
      if (this.data.codeText != '') {
        this.setData({
          telephoneCode: e.detail.value
        })
      } else {
        this.setData({
          memTelephone: e.detail.value
        })
      }
    },
    // 输入框 获取输入的 验证码
    bindVerInput(e) {
        this.setData({
          cerInputNum: e.detail.value
        })
    },
    // 确认 按钮
    bindConfirmBoxBtnTap() {

      // 1、确定验证 会员
      // if (this.data.isConfiMemPhone) {
        // 判空
        if (this.data.memTelephone != '') {
          this.confirmCertification();
        }else{
          wx.showToast({
            title: "请输入手机号",
            icon: 'none'
          })
        }
      // }
      // 2、确定 验证 验证码
      if (this.data.needVerCode) {
        this.confirmPhoneCode();
        clearTimeout(mytimer);
      }
    },
    // 获取 gym list 
    getGYMList() {
      homeService.queryGYMList().then((result) => {
        this.setData({
          gymList: homedata.formatGYMList(result.gymList),
          // isGYMListHidden: true
        })
      }).catch((error) => {
        console.log(error);
      })
    },
    // 门店 列表 选择
    bindGymCellTap(e) {
      var gymList = this.data.gymList;
      var index = e.currentTarget.id;

      gymList.forEach(item => {
        item.checked = false;
      })
      gymList[index].checked = true;

      this.setData({
        gymList: gymList,
        gym: gymList[index].gym
      })

    },
    // 确定 选择 门店
    confirmNewMemInfo() {
      let infoDic = {
        memTelephone: this.data.memTelephone,
        gym: this.data.gym
      };

      homeService.uploadNewMem(infoDic).then((result) => {

        this.setData({
          isCertificationMem: true,
          modalHidden: true
        })
        // 保存 会员信息
        AuthService.saveMemberInfo(result.newMem);
        wx.switchTab({
          url: 'club'
        })
      }).catch((error) => {
        console.log(error);
      })
    }
})