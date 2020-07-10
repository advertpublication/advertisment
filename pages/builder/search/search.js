import { httpPost } from "../../../utils/util.js";
const BULID_LIST_URL = "/bulidList"; // 审核人列表
Page({

  /**
   * 页面的初始数据
   */
  data: {
    input: "", // 输入框内容
    list: [ // 搜索结果 列表
      // {
      //   imgurl: "../../../images/2.png",
      //   contractName: "江苏永达户外",
      //   medialocation: "哈尔滨站-候车室、售票大厅",
      //   medialocation2: "展位*2、挂幅*1、吊旗*2",
      //   range: "2019.03.30 ~ 2019.04.29 ( 30天 )",
      //   registerDate: "2019.3.17",
      //   company: "李宁体育用品有限公司",
      //   type: "运动"
      // },
      // {
      //   imgurl: "../../../images/4.png",
      //   contractName: "江苏永达户外",
      //   medialocation: "苏州站-售票大厅、候车室",
      //   medialocation2: "售票机*10、灯箱*4、LED*10",
      //   range: "2019.03.30 ~ 2019.04.29 ( 30天 )",
      //   registerDate: "2019.3.24",
      //    company: "NIKE运动",
      //   type: "运动"
      // },
    ],
  },

  /**
   * 输入框输入
   */
  doInput(e) {
    this.setData({
      input: e.detail.value,
    });
    //根据多条件筛查list
    let url = BULID_LIST_URL;
    let params = {
      loginName: wx.getStorageSync("userInfo").loginName, // 用户登录名
      stationId: "", // 媒体车站主键
      positionId: "", // 媒体位置主键
      companyId: "", // 广告公司主键
      condition: this.data.input || "",
      railwaybureau: wx.getStorageSync("userInfo").railwaybureau, // 路局编码
      start: 0, // 页数
      end: 10, // 每页加载数量
    };
    httpPost(url, params).then(res => {
      console.log("施工列表 条件查询后list", res);
      this.setData({
        list: res || [],
      });
    });
  },


  /**
   * 清空输入框
   */
  clearInput() {
    this.setData({
      input: "",
      list: []
    });

  },

  /**
 * 点击列表项 直接跳转到详情页
 */
  toDetail(e) {
    // 缓存上刊主键
    let itemId = e.currentTarget.dataset.id;
    //wx.setStorageSync("itemId", itemId);
    // 缓存上刊编号
    let previousno = e.currentTarget.dataset.previousno;
    //wx.setStorageSync("previousno", previousno);

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