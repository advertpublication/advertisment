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
        constStationPerson:res.data[0].constStationPerson,
        constStationPersonPhone:res.data[0].constStationPersonPhone,
        stationNegotiationContent:res.data[0].commentConts
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
  /*
   * 失焦事件
   **/
  textarea: function(e) {
    this.setData({
      stationNegotiationContent: e.detail.value
    });
  },

   //得到施工人员姓名
   doConstStationPerson(e) {
    this.setData({
      constStationPerson: e.detail.value,
    });
  },
  //得到施工人员姓名
  doConstStationPersonPhone(e) {
    this.setData({
      constStationPersonPhone: e.detail.value,
    });
  },

   /**
   * 点击 提交/确认 按钮
   */
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
     * 站段负责人提交
     */
    doNegotiation(state){
      console.log(state);
      if(!this.data.constStationPerson){
        wx.showToast({
          title: "请填写站段接洽人姓名",
          icon: 'none',
          duration: 2000,
          })
         return;
      }
      if(!this.data.constStationPersonPhone){
        wx.showToast({
          title: "请填写站段接洽人电话",
          icon: 'none',
          duration: 2000,
          })
         return;
      }else{
        //校验电话号码是否符合要求
        var mobile = /^[1][3,4,5,7,8][0-9]{9}$/;
        var isMobile = mobile.exec(this.data.constStationPersonPhone)
       if(!isMobile){
        wx.showToast({
          title: "请输入格式正确的电话号码",
          icon: 'none',
          duration: 2000,
          })
          return;
       }
      }
      let url=SAVE_STATION;
      let params={
        id:this.data.list[0].id,
        dwId:this.data.item.id,//上刊id
        type:this.data.type,//当前登录用户的用户类型
        dwConstUserId:this.data.list[0].dwConstUserId || '',//施工单位负责人
        stationLeaderId:this.data.list[0].stationLeaderId,//站段负责人id
        state:state,//洽谈状态
        // constStationPersonId:this.data.uList[this.data.index].id,
        constStationPerson:this.data.constStationPerson || '',//洽谈人姓名
        constStationPersonPhone:this.data.constStationPersonPhone || '',//洽谈人电话
        constTime:this.data.dates+" "+this.data.times,//预计施工时间
        commentConts:this.data.stationNegotiationContent || '',//洽谈工作
      }
      httpPostNew(url, params).then(res => {
        console.log(res,"已开启施工洽谈")
        if(res.obj){
          if(state==0){
            let that=this
            wx.showToast({
              title: "已开启施工洽谈",
              icon: 'none',
              duration: 4000,
              success:function(){
                // wx.navigateBack({
                //   delta: 1,
                // })
               that.setData({
                 hide:false
               })
              },
              })
          }else if(state==1){
            wx.showToast({
              title: "施工洽谈已确认",
              icon: 'none',
              duration: 20000,
              success:function(){
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
    console.log(options,"nhl----站段负责人详情页");
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
    this.getDetailsNegotiation()
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