// pages/club/club.js

import * as AuthService from '../../services/auth-service';
import * as clubService from '../../services/club-service';
import * as clubdata from '../../utils/clubdata-format';

  /**
   * 页面的初始数据
   */
let pageOptions = {

  data: {
    swiperImgUrls: [],

    clubList: [],
    clubListPageIndex: 1,

    articleList:[],
    hasArticle:false,
    buyCardActiveList:[],
    hasCards:false,
    memActiveList:[],
    hasActivities:false,
    gymInfo:"",

    limitImgs:[],

    emptyData:{
      emptyIcon:"../../images/bg_img/no_data.png",
      emptyText:''
    },
    

    isCertificationMem: false,
    is_modal_Hidden: true,

    loadMoreHidden: true,
    loadMoreRemaindHidden: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getClubdyList();

  },
  onShow: function (options) {
    this.getCertifiMem();
    if (this.data.isCertificationMem) {
      // 获取 活动列表
      this.getClubdyList();
      // this.getClubList('load');
    }

  },
  onUnload: function (options) {
    this.setData({
      clubList: [],
      articleList:[],
      hasArticle:false,
      buyCardActiveList:[],
      hasCards:false,
      memActiveList:[],
      hasActivities:false,
      clubListPageIndex: 1
    })
  },
  onHide: function (options) {
    this.setData({
      clubList: [],
      articleList:[],
      hasArticle:false,
      buyCardActiveList:[],
      hasCards:false,
      memActiveList:[],
      hasActivities:false,
      clubListPageIndex: 1
    })
  },
  getCertifiMem() {
    if (AuthService.getMemberInfo()) {
      this.setData({
        isCertificationMem: true
      })
      console.log('*已认证会员*');
    } else {
      console.log('*未认证会员*');
    }
  },

  // getClubdyList() {
  //   clubService.queryClubArticleList(this.data.clubListPageIndex).then((result) => {
  //     this.setData({
  //       clubList: clubdata.formatClubDynamicsList(result.result, this.data.clubList)
  //     })
  //   }).catch((error) => {
  //     console.log(error);
  //   })
  // },

  getClubdyList(){
    clubService.queryClubAll().then((result)=>{
      this.setData({
        articleList: clubdata.formatClubDynamicsList(result.articleList, this.data.articleList),
        buyCardActiveList: clubdata.formatClubDynamicsList(result.buyCardActiveList, this.data.buyCardActiveList),
        memActiveList: clubdata.formatClubDynamicsList(result.memActiveList, this.data.memActiveList),
        swiperImgUrls: result.clubImages,
        gymInfo:result.gymInfo.gym_name,
        limitImgs:result.limitActives
      })
      console.log(result);
      if (result.buyCardActiveList.length > 0) {
        this.setData({
          hasCards:true
        })
      }
      if (result.memActiveList.length > 0) {
        this.setData({
          hasActivities:true
        })
      }
      if (result.articleList.length > 0) {
        this.setData({
          hasArticle:true
        })
      }
    }).catch((error)=>{
      console.log(error);
    })
  },


    // 上拉触底 加载
  onReachBottom: function (options) {
    console.log('到底啦！！');

    // var clubListPageIndex = this.data.clubListPageIndex;
    // clubListPageIndex++;
    // this.setData({
    //   clubListPageIndex: clubListPageIndex,
    //   articleList:[],
    //   buyCardActiveList:[],
    //   memActiveList:[],
    // })

    // this.getClubdyList();
  },
  // 上拉触底 加载
  // onReachBottom: function (options) {
  //   console.log('到底啦！！');

  //   var clubListPageIndex = this.data.clubListPageIndex;
  //   clubListPageIndex ++;
  //   this.setData({
  //     clubListPageIndex: clubListPageIndex,
  //     loadMoreHidden: false
  //   })

  //   if (this.data.isCertificationMem) {
  //     this.getClubList('noload');
  //   }
  // },

  // 查询推荐活动
  // getClubList(noload) {
  //   clubService.quaryClubList(this.data.clubListPageIndex, 'N', noload).then((result) => {
  //     this.setData({
  //       clubList: clubdata.formatClubList(result.result, this.data.clubList),
  //       swiperImgUrls: result.clubImages
  //     })
  //   }).catch((error) => {
  //     console.log(error);
  //     this.setData({
  //       loadMoreHidden: true,
  //       loadMoreRemaindHidden: false
  //     })
  //   })
  // },

  bindMemberActivitiesTap(e) {
    var flag=e.currentTarget.dataset.activeflag
    if (this.data.isCertificationMem) {
      wx.navigateTo({
        url: 'memberActivities?activeFlag='+flag,
      })
    } else {
      this.setData({
        is_modal_Hidden: false
      })
    }
  },
  bindClubDynamicsTap(e) {
    if (this.data.isCertificationMem) {
      wx.navigateTo({
        url: 'clubDynamics',
      })
    } else {
      this.setData({
        is_modal_Hidden: false
      })
    }
  },

  // 俱乐部动态详情
  bindClubdyCellTap (e) {
    wx.navigateTo({
      url: 'clubDynamicsDetails?articleId=' + e.currentTarget.id,
    })
  },
  bindClubCellTap(e) {
    if (this.data.isCertificationMem) {
      wx.navigateTo({
        url: 'memberActivitiesDetails?activeId=' + e.currentTarget.id,
      })
    } else {
      this.setData({
        is_modal_Hidden: false
      })
    }
  }
}

Page(pageOptions)