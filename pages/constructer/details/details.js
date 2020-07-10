import {
  httpPost,
  httpPostNew,
  HOST
} from "../../../utils/util.js";
const CONSTRUCTER_LIST_URL = "/constructerList"; //施工人员列表
const IMAG_URL = "/getImageByFlag"; //资质、点位信息
const CONS_DIS_URL = "/myConstructionsDistribution"; // 施工分配
const SEND_CON_MESSAGE ="/sendBulidMessage";//发送施工提醒
const QUERY_STATION_USER="/queryStationUser"//站段负责人
const SAVE_STATION="/saveStation"//开启施工洽谈
const BULID_MANAGE_URL="/getBuilderManager"//得到施工负责人及站段接洽人信息
const CONFIRM_URL='/buildConfirm';//施工确认
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item: "", // 点击项数据
    roleType: 0, //用户的角色类型
    starWidth: "102rpx", // 黄星星容器宽度
    select: false, //流程下拉框数组
    pickerArray: [ // picker选项
      // ["沈阳站", "鞍山站"],
      // ["售票厅", "候车室", "进站口", "出站口"],
      // ["长春金道广告", "沈阳瑞德广告", "南京永达"]
    ],
    pickerIndex: [0, 0, 0], // picker选中项
    isMp4: [], //是否是视频
    history: [], // 审批历史
    select_all: false, //全选全不选
    mediaIdChecked: [], //被选中的么媒体资源id数组
    examine: false, //开启施工分配选择框
    negotiationExamine:false,//开启
    dates: '2019-08-01',
    times: '12:00',
    index1: 0,//施工人列表1索引值
    index2: 0,//施工人列表2索引值
    constructerList: [], //施工人员列表
    constructerArray: ['请选择施工人员'],//施工人array
    selectConsUserId:[0],//施工人员1userId
    selectConsUserId1:[0],//施工人员1userId
    selectConsUserId2: '',//施工人员21userId
    selevtConsuserName:'',//施工人员名字
    constructionStationFlag:1,//是否开启施工洽谈 0-开启，1-不开启
    negotiationContent:"",//洽谈内容
    stationUserList:[],//站段负责人集合
    isNegotiated:false,//是否开启过洽谈 false--不能开启，true--开启
    myArray: [], //存放车底号和索引的数组
    myResourceArray: [], //存放车底号和车底号对应的媒体资源的数组
    traincount: 0, //列车的总组数
  },

  /**添加施工 */
  addSelectConsUserId(){
    this.data.selectConsUserId.push(0)
    this.data.constructerArray.push('请选择施工人员')
    this.setData({
      selectConsUserId: this.data.selectConsUserId,
      constructerArray: this.data.constructerArray
    })
  },
  /**删除施工人员 */
  delSelectConsUserId(e){
    this.data.selectConsUserId.splice(e.target.dataset.index,1)
    this.data.constructerArray.splice(e.target.dataset.index, 1)
    this.setData({
      selectConsUserId: this.data.selectConsUserId,
      constructerArray: this.data.constructerArray
    })
  },

  /**选择施工 */
  focusSelectConsUserId(e){
    this.data.activeIndex = e.target.dataset.index
  },
  changeSelectConsUserId(e){
    console.log(e,)
    this.data.selectConsUserId[this.data.activeIndex] = e.detail.value
    this.data.constructerArray[this.data.activeIndex] = this.data.constructerList[e.detail.value-1].name
    this.setData({
      selectConsUserId: this.data.selectConsUserId,
      constructerArray: this.data.constructerArray
    })
  },
  /**
   * 跳转到 企业信息
   */
  companyInfo() {
    wx.navigateTo({
      url: '../../new/company_info/company_info?qualificationImag=' + JSON.stringify(this.data.item.qualificationlist)
    })
  },


  /**
   * 跳转到点位信息
   */
  issueContent() {
    //console.log(this.data.item.cmMediaImgList);
    wx.navigateTo({
      url: '../../new/issue_content/issue_content?cmMediaImgList=' + JSON.stringify(this.data.item.cmMediaImgList),
    })
  },
  /**
   * 跳转到媒体详情
   */
  mediaInfo() {
    //console.log(this.data.item.dwAdvertinstallresourceList);
    wx.navigateTo({
      url: '../../new/media_info/media_info?dwAdvertinstallresourceList=' + JSON.stringify(this.data.item.dwAdvertinstallresourceList),
    })
  },

  /**
   * 预览 效果图 图片
   */
  previewImage: function(e) {
    //console.log(e)
    let src = e.currentTarget.dataset.src; //获取data-src
    let imgList = this.data.item.materiallist; //获取data-list
    // 图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList, // 需要预览的图片http链接列表
      fail: function() {
        // console.log('图片预览 失败!!');
      }
    })
  },

  /**
   * 施工分配
   */
  saveConsDist() {
    // if (this.data.mediaIdChecked.length == 0) {
    //   wx.showToast({
    //     title: "请选择要分配的媒体",
    //     icon: 'none',
    //     duration: 2000,   
    //   })
    // } else {
      let url = CONSTRUCTER_LIST_URL;
      let params = {
        railwaybureau: wx.getStorageSync("userInfo").railwaybureau, // 路局编码
        publType:this.data.item.publType,//上刊类型
      }
      httpPost(url, params).then(res => {
        let constructerArray1 = ['请选择施工人员1'];
        let constructerArray2 = ['请选择施工人员2'];
        if (res && res != "undefined"){
          for (var u in res){
            constructerArray1.push(res[u].name);
            constructerArray2.push(res[u].name);
          }
       }
        this.setData({
          constructerList: res,
          constructerArray1: constructerArray1,
          constructerArray2: constructerArray2,
          examine: true
        })
        wx.hideLoading();
      })

    // }
  },
  /**
   * 时间、日期的选择
   */
  //  点击时间组件确定事件  
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
  bindPickerChange1: function (e) {
    //console.log('picker发送选择改变，携带值为', e.detail.value,this.data.constructerList[e.detail.value-1])
    this.setData({
      index1: e.detail.value,
      selectConsUserId1: this.data.constructerList[e.detail.value-1].id
    })
  },

  bindPickerChange2: function (e) {
   // console.log('picker2发送选择改变，携带值为', e.detail.value, this.data.constructerList[e.detail.value])
    this.setData({
      index2: e.detail.value,
      selectConsUserId2: this.data.constructerList[e.detail.value-1].id
    })
  },
  /**
   * 全选、全不选
   */
  // 全选
  checkedAll: function(e) {
    var that = this
    var value = e.detail.value;
    var valLen = value.length
    var list = that.data.item.dwAdvertinstallresourceList
    var listLen = list.length
    if (valLen != 0) {
      for (var i = 0; i < listLen; i++) {
        list[i].checked = true;
        that.data.mediaIdChecked.push(list[i].id)
      }
      that.setData({
        checked_all: true, //全选
        "item.dwAdvertinstallresourceList": list
      })
    } else {
      for (var i = 0; i < listLen; i++) {
        list[i].checked = false
      }
      that.setData({
        mediaIdChecked: [],
        checked_all: false,
        "item.dwAdvertinstallresourceList": list
      })
    }
  },
  //单选
  checkboxChange: function(e) {
    var that = this
    var value = e.detail.value;
    var valLen = value.length
    var checkid = e.target.dataset.checkid
    var list = that.data.item.dwAdvertinstallresourceList
    var listLen = list.length
    var num = 0
    if (valLen != 0) { //选中
      for (var i = 0; i < listLen; i++) {
        if (list[i].id == checkid) {
          if (!list[i].checked) {
            list[i].checked = true;
            num = num + 1;
            that.data.mediaIdChecked.push(list[i].id);
          }
        } else {
          if (list[i].checked) {
            num = num + 1;
          }
        }
      }
      if (num == listLen) {
        that.setData({
          checked_all: true //全选
        })
      }
    } else {
      var arr = []
      var trolleyLen = that.data.mediaIdChecked.length
      for (var i = 0; i < listLen; i++) {
        if (list[i].id == checkid) {
          if (list[i].checked) {
            list[i].checked = false
            for (var j = 0; j < trolleyLen; j++) {
              if (that.data.mediaIdChecked[j] == checkid) {
                continue;
              } else {
                arr.push(that.data.mediaIdChecked[j])
              }
            }
          }
        }
      }
      that.setData({
        mediaIdChecked: arr,
        checked_all: false
      })
    }
    that.setData({
      "item.dwAdvertinstallresourceList": list
    })

  },
  /**
   * 下拉框
   */
  bindShowMsg() {
    this.setData({
      select: !this.data.select
    })
  },

  /**
   * 取消分配
   */
  noApprove() {
    this.setData({
      selectConsUserId: [0],
      constructerArray: ['请选择施工人员'],
      examine: false
    })
  },
  /**
   * 得到施工人的userId和Name
   */
  getDate: function (e) {
   this.setData({
     selectConsUserId:e.detail.id,
     selevtConsuserName:e.detail.conNowText
   })
  },

  /**
   * 确认分配
   */
  doApprove() {
    //判断施工时间是否为空
    //console.log(this.data.selectConsUserId1, this.data.selectConsUserId2);
    if (this.data.dates == null || this.data.times == "") {
      wx.showToast({
        title: "请选择施工时间",
        icon: 'none',
        duration: 2000,
      })
      return ;
    }
   //判断施工人员是否为空
    if (this.data.selectConsUserId.length == 1 && this.data.selectConsUserId[0] == 0) {
      wx.showToast({
        title: "请选择施工人员",
        icon: 'none',
        duration: 2000,
      })
      return ;
      // this.data.selectConsUserId1=this.data.constructerList[0].id
    }
    // if (this.data.item.publType == '1'){
    //   if (this.data.selectConsUserId2 == null || this.data.selectConsUserId2 == "") {
    //     wx.showToast({
    //       title: "请选择施工人员2",
    //       icon: 'none',
    //       duration: 2000,
    //     })
    //     return;
    //     // this.data.selectConsUserId1=this.data.constructerList[0].id
    //   }
    // }
    if (new Set(this.data.selectConsUserId).size !== this.data.selectConsUserId.length) {
      wx.showToast({
        title: "施工人重复",
        icon: 'none',
        duration: 2000,
      })
      return;
    }
    // if (this.data.selectConsUserId1 == this.data.selectConsUserId2){
    //   wx.showToast({
    //     title: "施工人重复",
    //     icon: 'none',
    //     duration: 2000,
    //   })
    //   return;
    // }

    //确定施工分配
    let url = CONS_DIS_URL;
    let params = {
      dwAdvertinstallId: this.data.item.id,//上刊Id
      consUserId: JSON.stringify(this.data.selectConsUserId),//被分配施工任务的施工人员 ID数组
      consUserId1: this.data.selectConsUserId1 ||"",//被分配施工任务的施工人员Id1
      consUserId2: this.data.selectConsUserId2 || "",//被分配施工任务的施工人员Id2
      consTime:this.data.dates+" "+this.data.times,//施工时间
      createBy:wx.getStorageSync('userInfo').accountId || '',//施工负责人id
      railwaybureau:wx.getStorageSync('userInfo').railwaybureau || '',//局码
      publType:this.data.item.publType,//上刊类型
      //dwAdvertinstallresourceList: JSON.stringify(this.data.item.dwAdvertinstallresourceList)//要分配的媒体资源列表
    };
    httpPostNew(url, params).then(res => {
      if(res.obj){
        this.setData({
          examine: true
        })
        wx.navigateBack({
          delta: 1,
        })
      }
    })
  },
  /**
   * 给dates,times赋初始值
   */
  getTime() {
    var myDate = new Date(); //获取系统当前时间
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
   * 发送施工提醒消息
   */
sendConsMsg(){
  let url = SEND_CON_MESSAGE;
  let params = {
   id: this.data.item.id,//上刊Id
   railwayBureau: wx.getStorageSync("userInfo").railwaybureau, // 路局编码
  };
  httpPostNew(url, params).then(res => {
     //console.log(res.obj)
    if (res.obj) {
      wx.showToast({
        title: "施工提醒发送成功",
        icon: 'none',
        duration: 2000,
      })
    }
    wx.hideLoading();
  })
},

/**
 * 施工洽谈 
 */
negotiation(){
  //1.首先根据上刊id确定是否进行了洽谈
    let url=BULID_MANAGE_URL;
    if(this.data.stationUserList.length == 0){
      wx.showToast({
        title: "请先配置站段洽谈人",
        icon: 'none',
        duration: 2000,
        })
       return;
    }
    let params = {
      id: this.data.item.id, // 上刊主键
      registerId: this.data.stationUserList[0].id, //用户主键
      userName: wx.getStorageSync("userInfo").name, //用户姓名
      userType:wx.getStorageSync('userInfo').userType,//用户类型
    };
    httpPostNew(url, params).then(res => {
      //console.log(res,"施工负责人洽谈详情页");
      if(res.data && res.data.length>0){
        this.setData({
          isNegotiated:true,
          uList:res.list || [],
          list:res.data  || [],
          stationNegotiationContent:res.data[0].commentConts || [],
          negotiationContent:res.data[0].workContent || []
        })
      }else{
        //弹出第一次洽谈框
        this.showFrist();
      }
      wx.hideLoading();
      this.getTime();
    });
    // wx.navigateTo({
    //   url: "../details_wx/details_wx?dwId=" + this.data.item.id + "&loginName=" + wx.getStorageSync("userInfo").loginName + "&userId=" + wx.getStorageSync("userInfo").accountId
    // });
},
/**
 * 弹出第一次洽谈框
 */
showFrist(){
  for(var  i=0;i < this.data.item.dwAdvertinstallresourceList.length; i++){
    if(!this.data.item.dwAdvertinstallresourceList[i].constructionTime){
      wx.showToast({
      title: "请先进行施工分配",
      icon: 'none',
      duration: 2000,
      })
     return;
    }
 }
this.setData({
  negotiationExamine:true
})
wx.hideLoading();
},
  /**
   * 得到施工负责人洽谈信息 施工时间、施工人员姓名、负责人意见
   */
  getBuilderManager(){
    let url=BULID_MANAGE_URL;
    let params = {
      id: this.data.item.id, // 上刊主键
      registerId: this.data.stationUserList[0].id, //用户主键
      userName: wx.getStorageSync("userInfo").name, //用户姓名
      userType:wx.getStorageSync('userInfo').userType,//用户类型
    };
    httpPostNew(url, params).then(res => {
      //console.log(res,"施工负责人洽谈详情页");
      if(res.list && res.list.length>0){
        this.setData({
          isNegotiated:true,
          uList:res.list,
          list:res.data,
          stationNegotiationContent:res.data[0].commentConts
        })
      }
      wx.hideLoading();
      this.getTime();
    });
   },

//得到站段负责人列表
getStationUserList(){
  let url=QUERY_STATION_USER;
  let params = {
    dwId: this.data.item.id,//上刊Id
   }
  return httpPost(url, params).then(res => {
    console.log(res,"站段负责人列表")
    this.setData({
      stationUserList:res || []
    })
    return Promise.resolve();
  }).catch(()=>{
    console.log("异常");
    return Promise.resolve();
  })
},

/**
 * 取消洽谈
 */
 cancel(){
  this.setData({
    negotiationExamine:false,
    isNegotiated:false
  })
},
/**
 * 记录洽谈内容
 */
textarea: function(e) {
  this.setData({
    negotiationContent: e.detail.value
  });
},
/**
 * 施工洽谈
 */
doNegotiation(e){
console.log(e.target.dataset);
 let state=e.target.dataset.status;
 let url=SAVE_STATION;
 let params={};
 //是否已开启施工审批
 //console.log(this.data.list);
 if(this.data.isNegotiated){
   params={
    id:this.data.list[0].id,
    dwId:this.data.item.id,//上刊id
    dwConstUserId:wx.getStorageSync("userInfo").accountId,//施工负责人id
    type:wx.getStorageSync("userInfo").type,//当前登录用户的用户类型
    stationLeaderId:this.data.list[0].stationLeaderId,//站段负责人id
    state:state,//洽谈状态
    constTime:this.data.dates+" "+this.data.times,//预计施工时间
    workContent:this.data.negotiationContent,//洽谈工作   
  }
 }else{
if(this.data.stationUserList.length == 0){
  wx.showToast({
    title: "请配置接洽的站段",
    icon: 'none',
    duration: 2000,
    })
   return;
}
params={
  dwId:this.data.item.id,//上刊id
  type:wx.getStorageSync("userInfo").type,//当前登录用户的用户类型
  dwConstUserId:wx.getStorageSync("userInfo").accountId,//施工负责人id
  dwConstUserName:wx.getStorageSync("userInfo").name,//施工负责人姓名
  dwConstUserMobile:wx.getStorageSync("userInfo").phone,//施工负责人电话
  stationOfficeId:this.data.stationUserList[0].officeId,//站段id
  stationOfficeName:this.data.stationUserList[0].officeName,//站段名称
  stationLeaderId:this.data.stationUserList[0].id,//站段负责人id
  stationLeaderName:this.data.stationUserList[0].name,//站段负责人姓名
  stationLeaderPhone:this.data.stationUserList[0].phone,//站段负责人电话
  constTime:this.data.item.dwAdvertinstallresourceList[0].constructionTime,//预计施工时间
  workContent:this.data.negotiationContent,//洽谈工作
  state:0//洽谈状态 0-洽谈中 ，1-洽谈完成
}
}
httpPostNew(url, params).then(res => {
  console.log(res,"已开启施工洽谈")
  if(res.obj){
    wx.showToast({
      title: "已开启施工洽谈",
      icon: 'none',
      duration: 2000,
      })
      this.cancel();
      wx.navigateBack({
        delta: 1
      })
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options.item,"施工分配详情页信息")
    if (options.item && options.item != "undefined") {
      for (var index in JSON.parse(options.item).materiallist) {
        this.data.isMp4[index] = JSON.parse(options.item).materiallist[index].indexOf(".mp4") == -1;
      }
      let traincount = 0;
      for (var index in JSON.parse(options.item).dwAdvertinstallresourceList) {
        traincount += parseInt(JSON.parse(options.item).dwAdvertinstallresourceList[index].mediacount);
      }
      this.setData({
        item: JSON.parse(options.item), //详情页数据
        roleType: wx.getStorageSync("userInfo").roleType,
        railwaybureau: wx.getStorageSync("userInfo").railwaybureau,
        isMp4: this.data.isMp4, //是否是视频
        constructionStationFlag:wx.getStorageSync('constructionStationFlag'),//是否开启施工洽谈 0-开启，1-不开启
        traincount: traincount, //列车的总组数
      });
      Promise.all([this.getTime(), this.getStationUserList(),this.myArrayInput()]).then(() => {
        wx.hideLoading();
      })
    }
  },

  /**
   * 施工结果确认
   */
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  /**
    * 阻止蒙层下面页面滚动
    */
  preventTouchmove() {
      console.log("我是details里面的滑动方法")
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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