import { httpPost } from "../../../utils/util.js";
const LOG_URL = "/approvalLog";


Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 0, // 当前页码
    log: [], // 审核表
  },

  /**
   * 切换swiper
   */
  swipe(e){
    this.setData({
      current: e.currentTarget.dataset.current
    });
  },

  /**
   * swiper变化
   */
  swiperChange(e){
    this.setData({
      current: e.detail.current
    });
  },

  /**
   * 获取操作日志
   */
  getLog(){
    let url = LOG_URL;

    let journaltype = "";
    let officeId = wx.getStorageSync("id");
    if(officeId == "proposer"){
      journaltype = "0";
    }else if(officeId == "verifier"){
      journaltype = "1";
    }

    let params = {
      id: this.data.item.id,
      journaltype
    }

    httpPost(url, params).then(res => {
      console.log("日志列表log", res);
      this.setData({
        log: res || []
      });
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 接收点击的数据
    if(options.item && options.item != "undefined"){
      this.setData({
        item: JSON.parse(options.item)
      });
    }

    // 获取操作日志
    this.getLog();

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