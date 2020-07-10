import { httpPost } from "../../../utils/util.js";
const OPTIONS_URL = "/screen"; // picker选项
const LIST_URL = "/publishlist"; // 受理人列表
const VERIFY_LIST_URL = "/publishApprovalList"; // 审核人列表
const HISTORY_URL = "/processHistoryList"; // 审核人日志

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "", // 用户身份
    business: "", // 业务
    station: { // 过滤车站
      id: "",
      name: "请选择车站"
    }, 
    area: { // 过滤位置
      id: "",
      name: "请选择区域", 
    }, 
    company: { // 过滤公司
      id: "",
      name: "请选择公司"
    },
    pickerList: [], // 选择器内容
    pickerIndex: [0, 0, 0], // 选择器 选中下标
    list: [], // 列表数据
  },

  /**
   * 获取筛选条件
   */
  getOptions() {
    let url = OPTIONS_URL;
    let business = wx.getStorageSync("business");
    let params = {
      submission: business == "proposer-check" ? 1 : "", //提交状态
      acceptancestatus: "", //上刊受理状态
      flowstatus: "", // 流程审批状态
      railwaybureau: wx.getStorageSync("userInfo").railwaybureau,  // 路局编码
    }

    httpPost(url, params).then(res => {
      console.log("筛选条件options", res);
      this.setData({
        "pickerList[0]": res ? res.station : [],
        "pickerList[1]": res ? res.position : [],
        "pickerList[2]": res ? res.company : [],
      });
    });
  },

  /**
   * picker点确定
   */
  pickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);

    let pickerList = this.data.pickerList;
    let value = e.detail.value;
    this.setData({
      station: pickerList[0][value[0]],
      area: pickerList[1][value[1]],
      company: pickerList[2][value[2]],
    });

    // 刷新数据
    this.decideAndGet();
  },

  /**
   * 清空筛选条件
   */
  clearFilter() {
    this.setData({
      station: { // 过滤车站
        id: "",
        name: "请选择车站"
      },
      area: { // 过滤位置
        id: "",
        name: "请选择区域",
      },
      company: { // 过滤公司
        id: "",
        name: "请选择公司"
      },
    });

    // 刷新数据
    this.decideAndGet();
  },

  /**
   * 获取 受理人 列表
   */
  getList() {
    let url = LIST_URL;

    let business = wx.getStorageSync("business");

    let params = {
      submission: business == "proposer-check" ? 1 : "", // 提交状态
      acceptancestatus: "", // 上刊受理状态
      flowstatus: "", // 流程审批状态
      stationId: this.data.station.id, // 媒体车站主键
      positionId: this.data.area.id, // 媒体位置主键
      companyId: this.data.company.id, // 广告公司主键
      railwaybureau: wx.getStorageSync("userInfo").railwaybureau,  // 路局编码
      pageNo: 0, // 页数
      pageSize: 10, // 每页加载数量
    };

    httpPost(url, params).then(res => {
      console.log("列表页list", res);
      this.setData({
        list: res || []
      });
    });
  },

  /**
   * 获取 审核人 列表
   */
  getVerifyList() {
    let url = VERIFY_LIST_URL;
    let params = {
      loginName: wx.getStorageSync("userInfo").loginName, // 用户登录名
      stationId: this.data.station.id, // 媒体车站主键
      positionId: this.data.area.id, // 媒体位置主键
      companyId: this.data.company.id, // 广告公司主键
      railwaybureau: wx.getStorageSync("userInfo").railwaybureau, // 路局编码
      pageNo: 0, // 页数
      pageSize: 10, // 每页加载数量
    };
    console.log(params);
    httpPost(url, params).then(res => {
      console.log("首页list", res);
      this.setData({
        list: res || []
      });
    });
  },

  /**
   * 获取 审核人 日志
   */
  getHistoryList() {
    let url = HISTORY_URL;
    let params = {
      accountId: wx.getStorageSync("userInfo").accountId, // 用户主键
      stationId: this.data.station.id, // 媒体车站主键
      positionId: this.data.area.id, // 媒体位置主键
      companyId: this.data.company.id, // 广告公司主键
      railwaybureau: wx.getStorageSync("userInfo").railwaybureau, // 路局编码
      pageNo: 0, // 页数
      pageSize: 10, // 每页加载数量
    };

    httpPost(url, params).then(res => {
      console.log("首页list", res);
      this.setData({
        list: res || []
      });
    });
  },

  /**
   * 跳转到详情页
   */
  toDetail(e) {
    console.log("列表点击项", e);
    // 缓存上刊主键
    let itemId = e.currentTarget.dataset.id;
    wx.setStorageSync("itemId", itemId);
    // 缓存上刊编号
    let previousno = e.currentTarget.dataset.previousno;
    wx.setStorageSync("previousno", previousno);

    let url = "../detail/detail";
    let business = wx.getStorageSync("business");

    if (business == "proposer-log" || business == "verifier-log") {
      url = "../log/log";
    }

    let item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: url + "?item=" + JSON.stringify(item)
    });
  },

  /**
   * 判断并获取与业务对应的列表
   */
  decideAndGet(){
    let id = wx.getStorageSync("id");
    let business = wx.getStorageSync("business");

    if (id == "proposer") { // 受理人
      this.getList();
    } else if (id == "verifier") { // 审核人
      if (business == "verifier-approve") {
        this.getVerifyList();
      } else if (business == "verifier-log") {
        this.getHistoryList();
      }
    }
  },


  /**
   * 跳转到过滤条件页面
   */
  // toFilter(){
  //   wx.navigateTo({
  //     url: "../location/location"
  //   });
  // },

  /**
   * picker列变化
   */
  // columnChange(e){
  //   console.log(e);
  //   let column = e.detail.column;

  //   // 第3列变化不请求数据
  //   if(column == 2) return;

  //   // 1、2列变化请求数据
  //   let pickerList = this.data.pickerList;
  //   let value = e.detail.value;

  //   if(column == 0){
  //     let station = pickerList[column][value];
  //     let area = this.data.area;
  //   }

  //   if(column == 1){
  //     let station = this.data.station;
  //     let area = pickerList[column][value];
  //   }

    
    
  // },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: wx.getStorageSync("id"),
      business: wx.getStorageSync("business")
    })
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
    this.getOptions();
    this.decideAndGet();
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