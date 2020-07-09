import { httpPost,httpPostNew } from "../../../utils/util.js";
const IMAG_URL = "/getImageByFlag";//资质、点位信息
const DETAILS_NEG_URL ="/details_negotiation";//具体信息页面
const SAVE_STATION="/saveStation"//开启施工洽谈
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item: "",// 点击项数据
    starWidth: "102rpx", // 黄星星容器宽度
    dwId:'',//上刊主键
    loginName:'',//登录名
    // name:'',//用户姓名
    userId:'',//用户主键
    isMp4: [], //是否是视频
    list:[],//施工负责人洽谈信息
    dates: '2019-08-01',//施工时间
    times: '12:00',//施工人员
    negotiationContent:"",//施工负责人意见
    constStationPerson:"",//洽谈人姓名
    constStationPersonPhone:"",//洽谈人电话
    stationNegotiationContent:"",//洽谈内容
    type:'',//用户类型
    hide:true,//隐藏
  },

  /** */
  getDetailsNegotiation(){
    let url = DETAILS_NEG_URL;
    let id = this.data.dwId; //上刊主键
    let loginName=this.data.loginName;//登录名
    let params = {
      dwId: id,
      loginName:loginName
    };
    httpPostNew(url, params).then(res => {
      console.log(res,"洽谈详情页的数据");
      for (var index in res.obj.materialImage) {
        this.data.isMp4[index] = res.obj.materialImage[index].indexOf(".mp4") == -1;
      }
      this.setData({
        item: res.obj || [],
        isMp4: this.data.isMp4, //是否是视频
        list:res.data,//施工负责人洽谈信息
        type:res.message,//用户类型
        constStationPerson:res.data[0].constStationPerson || '',
        constStationPersonPhone:res.data[0].constStationPersonPhone || '',
        stationNegotiationContent:res.data[0].commentConts || '',
        negotiationContent:res.data[0].workContent || ''
      });
      wx.hideLoading()
    });
  },

    /**企业信息*/
    companyInfo() {
      let params = {
        type: 0
      };
      wx.navigateTo({
        url: '../../new/company_info/company_info?qualificationImag=' + JSON.stringify(this.data.item.qualificationImag)
      })
      // httpPost(IMAG_URL, params).then(res => {
      // wx.navigateTo({
      //   url: '../../new/company_info/company_info?imag_url='+res
      // })
      // });
    },
  /**媒体详情 */
  mediaInfo() {
    wx.navigateTo({
      url: '../../new/media_info/media_info?dwAdvertinstallresourceList=' + JSON.stringify(this.data.item.dwAdvertinstallresourceList),
    })
  },
  /**点位信息 */
  issueContent() {
    wx.navigateTo({
      url: '../../new/issue_content/issue_content?cmMediaImgList=' + JSON.stringify(this.data.item.cmMediaImgList),
    })
  },
  /**
   * 
   */
  imgYu: function (e) {
    var src = e.currentTarget.dataset.src;//获取data-src
    var imgList = this.data.item.materialImage;//获取data-list

    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList, // 需要预览的图片http链接列表
      fail: function () {
        console.log('图片预览 失败!!');
      }
    })
  },
    /**
   * 给dates,times赋初始值
   */
  getTime() {
    var myDate = new Date(this.data.list[0].constTime); //获取系统当前时间
    var y = myDate.getFullYear(); //年份
    var m = myDate.getMonth() + 1; //月份
    var d = myDate.getDate(); //日期
    var H = myDate.getHours(); //小时
    var M = myDate.getMinutes(); //分
    this.setData({
      dates: y + "-" + m + "-" + d,
      times: H + ":" + M
    })
  },

    /**
   * 时间、日期的选择
   */
  bindTimeChange: function(e) {
    this.setData({
      times: e.detail.value
    })
  },
  //  点击日期组件确定事件  
  bindDateChange: function(e) {
    this.setData({
      dates: e.detail.value
    })
  },


   //得到施工人员姓名
   doConstStationPerson(e) {
    this.setData({
      constStationPerson: e.detail.value,
    });
  },
  //得到施工人员姓名t
  doConstStationPersonPhone(e) {
    this.setData({
      constStationPersonPhone: e.detail.value,
    });
  },

  /**
 * 记录洽谈内容
 */
textarea: function(e) {
  this.setData({
    negotiationContent: e.detail.value
  });
},
tapBtn(e) {
  let id = e.currentTarget.id;
  let state=0;
  if (id == 'approve') {
    //提交
    state=0
  } else if (id == 'reject') {
    //确认
    state=1;
  }
  this.doNegotiation(state);
},

/**
 * 施工洽谈
 */
doNegotiation(state){
 let url=SAVE_STATION;
 let params={
  id:this.data.list[0].id,
  dwId:this.data.item.id,//上刊id
  dwConstUserId:this.data.list[0].dwConstUserId || '',//施工负责人id
  type:this.data.type,//当前登录用户的用户类型
  stationLeaderId:this.data.list[0].stationLeaderId,//站段负责人id
  state:state,//洽谈状态
  constTime:this.data.dates+" "+this.data.times,//预计施工时间
  workContent:this.data.negotiationContent,//洽谈工作   
}
 //是否已开启施工审批
httpPostNew(url, params).then(res => {
  console.log(res,"已开启施工洽谈")
    if(res.obj){
      if(state==0){
        let that=this;
        wx.showToast({
          title: "已开启施工洽谈",
          icon: 'none',
          duration: 4000,
          success:function(){
            that.setData({
              hide:false
            })
            // wx.navigateBack({
            //   delta: 1,
            // })
          },
          })
      }else if(state==1){
        wx.showToast({
          title: "施工洽谈已确认",
          icon: 'none',
          duration: 4000,
          success:function(){
            this.onShow();
            // wx.navigateBack({
            //   delta: 1,
            // })
          },
          })
      }
    }
  wx.hideLoading();
}).catch(()=>{
  wx.hideLoading();
  console.log("异常");
})
},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options,"nhl----施工负责人详情页");
    if (options != null){
      if (options.dwId && options.dwId != "undefined") {
        this.setData({
          dwId: options.dwId,
        })
      }
      if (options.loginName && options.loginName != "undefined") {
        this.setData({
          loginName: options.loginName,
        })
      }
      if (options.userId && options.userId != "undefined") {
        this.setData({
          userId: options.userId,
        })
      }
    }
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // Promise.all([this.getDetailsNegotiation()]).then(() => {
    //   wx.hideLoading();
    // });
    this.getDetailsNegotiation();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})