import {
  httpPost,
  httpPostNew,
  HOST
} from "../../../utils/util.js";
const CONSTRUCTER_LIST_URL = "/constructerList"; //施工反馈结果
const IMAG_URL = "/getImageByFlag"; //资质、点位信息
const CONS_DIS_URL = "/myConstructionsDistribution"; // 历史审核人列表
const SEND_CON_MESSAGE = "/sendBulidMessage";//发送施工提醒
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
    myArray: [], //存放车底号和索引的数组
    myResourceArray: [], //存放车底号和车底号对应的媒体资源的数组
    traincount: 0, //列车的总组数
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
    console.log(this.data.item.dwAdvertinstallresourceList);
    wx.navigateTo({
      url: '../../new/media_info/media_info?dwAdvertinstallresourceList=' + JSON.stringify(this.data.item.dwAdvertinstallresourceList),
    })
  },

  /**
   * 预览 效果图 图片
   */
  previewImage: function (e) {
    //console.log(e)
    let src = e.currentTarget.dataset.src; //获取data-src
    let imgList = this.data.item.materiallist; //获取data-list
    // 图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList, // 需要预览的图片http链接列表
      fail: function () {
        // console.log('图片预览 失败!!');
      }
    })
  },
  // Input数组
  myArrayInput() {
    var resourceList = this.data.item.dwAdvertinstallresourceList;
    resourceList = resourceList.map(function (item, index) {
      var myArrayInput = [];
      for (var i = 0; i < item.mediacount; i++) {
        myArrayInput[i] = ""
      }
      item.inputArray = myArrayInput;
      return item;
    });
    this.setData({
      item: {
        ...this.data.item,
        dwAdvertinstallresourceList: resourceList
      }
    })
  },

 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
        isMp4: this.data.isMp4, //是否是视频
        traincount: traincount //列车的总组数
      });
    }
    this.myArrayInput();

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
  onShow: function () {

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