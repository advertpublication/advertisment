import { httpPost } from "../../../utils/util.js";
const BULID_LIST_URL = "/bulidList"; // 审核人列表
const OPTIONS_URL = "/screen"; // picker选项
Page({

  /**
   * 页面的初始数据
   */
   data: {
    station: { // 过滤车站
      id: "",
      name: "请选择车站"
    },
    position: { // 过滤位置
      id: "",
      name: "请选择区域",
    },
    company: { // 过滤公司
      id: "",
      name: "请选择公司"
    },
    list: [ // 未处理列表
      {
        imgurl: "../../../images/1.png",
        contractName: "南京永达",
        properystation: '武汉站',
        medialocation: "售票大厅",
        mediatype: "灯箱",
        mcount: "4",
        begindate: "2019.03.27",
        enddate: "2019.04.26",
        datenum: "30",
        bdid2name: "OPPO广东移动通信有限公司",
      },
      {
        imgurl: "../../../images/2.png",
        contractName: "南京永达",
        properystation: '哈尔冰站',
        medialocation: "候车室、售票大厅",
        mediatype: "展位",
        mcount: "2",
        begindate: "2019.03.27",
        enddate: "2019.04.26",
        datenum: "30",
        bdid2name: "李宁体育用品有限公司",
      },
      {
        imgurl: "../../../images/3.png",
        contractName: "南京永达",
        properystation: '哈尔冰站',
        medialocation: "候车室、售票大厅",
        mediatype: "售票机",
        mcount: "20",
        begindate: "2019.03.27",
        enddate: "2019.04.26",
        datenum: "30",
        bdid2name: "北京京东世纪贸易有限公司",
      },
      {
        imgurl: "../../../images/4.png",
        contractName: "南京永达",
        properystation: '苏州站',
        medialocation: "候车室、售票大厅",
        mediatype: "售票机",
        mcount: "20",
        begindate: "2019.03.27",
        enddate: "2019.04.26",
        datenum: "30",
        bdid2name: "NIKE运动",
      },
    ],
    pickerArray: [ // picker选项
      ["苏州站", "哈尔冰站", "武汉站"],
      ["售票厅", "候车室", "进站口", "出站口"],
      ["长春金道广告", "沈阳瑞德广告", "南京永达"]
    ],
    pickerIndex: [0, 0, 0], // picker选中项

  },

  /**
   * 跳转到 搜索页面
   */
  toSearch() {
    wx.navigateTo({
      url: "../search/search"
    });
  },

  /**
   * 获取 审核人 首页列表
   */
  getBulidList() {
    let url = BULID_LIST_URL;
    let params = {
      // loginName: wx.getStorageSync("userInfo").loginName, // 用户登录名
      properystation: this.data.station.id || "", // 媒体车站主键
      medialocation: this.data.position.id || "", // 媒体位置主键
      contractId: this.data.company.id || "", // 广告公司主键
      railwaybureau: wx.getStorageSync("userInfo").railwaybureau, // 路局编码
      start: 0, // 页数
      end: 10, // 每页加载数量
    };
    httpPost(url, params).then(res => {
      this.setData({
        list: res || [],
      });
    });
  },

  /**
   * 初始化picker数据，填充筛选条件
   */
  getPickerList() {
    let url = OPTIONS_URL;
    let params = {
      railwaybureau: wx.getStorageSync("userInfo").railwaybureau, // 路局编码
      loginName: wx.getStorageSync("userInfo").loginName//登录名
    }

    httpPost(url, params).then(res => {
      this.setData({
        "pickerArray[0]": res ? res.station : [],
        "pickerArray[1]": res ? res.position : [],
        "pickerArray[2]": res ? res.company : [],
      });
    });
  },

  /**
   * picker点确定
   */
  pickerChange(e) {
    let pickerArray = this.data.pickerArray;
    let value = e.detail.value;
    this.setData({
      station: pickerArray[0][value[0]],
      position: pickerArray[1][value[1]],
      company: pickerArray[2][value[2]],
    });
    console.log(this.data);
    // 刷新数据
    this.getBulidList();
  },




  /**
   * 点击列表项 直接跳转到详情页
   */
  toDetail(e) {
    // 缓存上刊主键
    let itemId = e.currentTarget.dataset.id;
    wx.setStorageSync("itemId", itemId);
    // 缓存上刊编号
    let previousno = e.currentTarget.dataset.previousno;
    wx.setStorageSync("previousno", previousno);

    // 跳转到详情页并传点击项数据
    let item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: "../details/details?item=" + JSON.stringify(item)
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.getBulidList(); //加载列表
    this.getPickerList(); //初始化pick中的数据
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