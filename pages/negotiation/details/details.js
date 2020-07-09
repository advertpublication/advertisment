import {
  httpPost,
  httpPostNew
} from "../../../utils/util.js";
const VERIFY_HIS_URL = "/approvalLog"; // 历史审核人列表
const Verifier_URL = "/approval"; // 审核人 业务审批
const IMAG_URL = "/getImageByFlag"; //资质、点位信息
const BULID_MANAGE_URL="/getBuilderManager"//得到施工负责人及站段接洽人信息
const SAVE_STATION="/saveStation"//开启施工洽谈
const CONFIRM_URL='/buildConfirm';//施工确认
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item: "", // 点击项数据
    examine: false, // 是否显示 审批意见 输入框
    approvalOpinion: '同意', //审批原因
    flowstatus: '', //审批状态
    starWidth: "102rpx", // 黄星星容器宽度
    isMp4: [], //是否是视频
    railwaybureau:'',//所属路局
    list:[],//施工负责人洽谈信息
    index:0,
    dates: '2019-08-01',
    times: '12:00',
    constStationPerson:"",//洽谈人姓名
    constStationPersonPhone:"",//洽谈人电话
    stationNegotiationContent:"",//洽谈内容
    constructionStationFlag:1,//是否开启施工洽谈 0-开启，1-不开启
    myArray: [], //存放车底号和索引的数组
    myResourceArray: [], //存放车底号和车底号对应的媒体资源的数组
    traincount: 0, //列车的总组数
  },

  /**
   * 阻止蒙层下面页面滚动
   */
  preventTouchmove() {

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

  /*
   * 失焦事件
   **/
  textarea: function(e) {
    this.setData({
      stationNegotiationContent: e.detail.value
    });
  },

  /**
   * 执行审批
   */
  doApprove() {
    this.setData({
      examine: false
    })
    // let params = {
    //   id: this.data.item.id, // 上刊主键
    //   accountId: wx.getStorageSync("userInfo").accountId, //用户主键
    //   userName: wx.getStorageSync("userInfo").name, //用户姓名
    //   commpentval: this.data.approvalOpinion, //审批意见
    //   flowstatus: this.data.flowstatus, // 流程审批状态
    // };
    // httpPost(Verifier_URL, params).then(res => {
    //   wx.hideLoading();
    //   wx.navigateBack({
    //     delta: 1
    //   })
    // });
    var approveResult = this.approve(Verifier_URL);

  },
  approve(Verifier_URL) {
    this.setData({
      examine: false
    })
    let params = {
      id: this.data.item.id, // 上刊主键
      accountId: wx.getStorageSync("userInfo").accountId, //用户主键
      userName: wx.getStorageSync("userInfo").name, //用户姓名
      commpentval: this.data.approvalOpinion, //审批意见
      flowstatus: this.data.flowstatus, // 流程审批状态
    };
    httpPostNew(Verifier_URL, params).then(res => {
     //console.log(res, "res");
      if (res.message.indexOf("审批成功") != -1) {
        if (res.obj && res.obj != "undefined") {
         wx.redirectTo({
            url: "../details/details?item=" + JSON.stringify(res.obj)
          });
        } else {
          // wx.showToast({
          //   title: "审批完毕",
          //   icon: 'success',
          //   duration: 3000,
          // })
          wx.redirectTo({
            url: "../home/home"
          });
        }
      } else if (res.message.indexOf("审批成功") == -1) {
        wx.showToast({
          title: res.message,
          icon: 'fail',
          duration: 3000,
        })
      }
      // wx.hideLoading();
      // wx.navigateBack({
      //   delta: 1
      // })
    });
  },

  noApprove() {
    this.setData({
      examine: false
    })
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

  imgYu: function(e) {
    // console.log(e)
    var src = e.currentTarget.dataset.src; //获取data-src
    var imgList = this.data.item.materialImage; //获取data-list

    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList, // 需要预览的图片http链接列表
      fail: function() {
        console.log('图片预览 失败!!');
      }
    })
  },
  /**
   * 得到审核详情列表
   */
  getVerifyHisList() {
    let url = VERIFY_HIS_URL;
    let id = this.data.item.id; //上刊主键
    let journaltype = "3"; //查询类型
    let params = {
      id: id,
      journaltype: journaltype
    };
    httpPost(url, params).then(res => {
      // console.log("审核历史list", res);
      this.setData({
        history: res || [],
      });
      wx.hideLoading();
    });
  },

  /**
   * 得到施工负责人洽谈信息 施工时间、施工人员姓名、负责人意见
   */
   getBuilderManager(){
    let url=BULID_MANAGE_URL;
    let params = {
      id: this.data.item.id, // 上刊主键
      registerId: wx.getStorageSync("userInfo").accountId, //用户主键
      userName: wx.getStorageSync("userInfo").name, //用户姓名
      userType:wx.getStorageSync('userInfo').userType,//用户类型
    };
    httpPostNew(url, params).then(res => {
      console.log(res,"施工负责人洽谈详情页");
      this.setData({
        list:res.data,
        constStationPerson:res.data[0].constStationPerson,
        constStationPersonPhone:res.data[0].constStationPersonPhone,
        stationNegotiationContent:res.data[0].commentConts
      })
      wx.hideLoading();
      this.getTime();
    });
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
 //选择施工人员
  // bindPickerChange1: function (e) {
  //   this.setData({
  //     index: e.detail.value
  //   })
  // },

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
      type:wx.getStorageSync("userInfo").type,//当前登录用户的用户类型
      dwConstUserId:this.data.list[0].dwConstUserId,//施工单位负责人
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
          wx.showToast({
            title: "已开启施工洽谈",
            icon: 'none',
            duration: 20000,
            success:function(){
              wx.navigateBack({
                delta: 1,
              })
            },
            })
        }else if(state==1){
          wx.showToast({
            title: "施工洽谈已确认",
            icon: 'none',
            duration: 20000,
            success:function(){
              wx.navigateBack({
                delta: 1,
              })
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

    // Input数组
myArrayInput() {
  var resourceList = this.data.item.dwAdvertinstallresourceList;
  resourceList = resourceList.map(function(item, index) {
    var myArrayInput = [];
    for (var i = 0; i < item.mediacount; i++) {
      myArrayInput[i] = ""
    }
    item.inputArray = myArrayInput;
    return item;
  });
  //console.log(resourceList,"resourceList");
  this.setData({
    item: { ...this.data.item,
      dwAdvertinstallresourceList: resourceList
    }
  })
},

//施工确认
buildConfirm(){
  let params = {
    userId:wx.getStorageSync('userInfo').userId,//用户id
    dwid: this.data.item.id,//上刊主键
    railwaybureau: wx.getStorageSync("userInfo").railwaybureau, //局码
    publType: this.data.item.publType, //上刊类型
  }
    httpPostNew(CONFIRM_URL, params)
      .then(res => {
        console.log(res,"已确认");
        if (res.message && res.message.indexOf("确认失败") != -1) {
          wx.showToast({
            title: res.message,
            icon: 'none',
            duration: 3000
          });
          //wx.hideLoading();
          return;
        } else if (res.message && res.message.indexOf("已确认") != -1) {
          wx.showToast({
            title: "已确认",
            icon: 'none',
            duration: 30000,
            success:function(){
              wx.navigateBack({
                delta: 1
              });
            }
          });
        }
      })
      .catch(err => {
        console.log(err);
        wx.hideLoading();
      });
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.item && options.item != "undefined") {
      for (var index in JSON.parse(options.item).materialImage) {
        this.data.isMp4[index] = JSON.parse(options.item).materialImage[index].indexOf(".mp4") == -1;
      }
      let traincount = 0;
      for (var index in JSON.parse(options.item).dwAdvertinstallresourceList) {
        traincount += parseInt(JSON.parse(options.item).dwAdvertinstallresourceList[index].mediacount);
      }
      this.setData({
        item: JSON.parse(options.item), //详情页数据
        isMp4: this.data.isMp4, //是否是视频
        constructionStationFlag:0,//是否开启施工洽谈 0-开启，1-不开启
        traincount: traincount, //列车的总组数
      });

      this.myArrayInput();

    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.setData({
      railwaybureau: wx.getStorageSync("userInfo").railwaybureau || '', // 路局编码
    });
    this.getBuilderManager(); //加载站段管理员信息
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})