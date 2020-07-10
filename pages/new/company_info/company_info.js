// pages/new/company_info/company_info.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qualificationImag:[],//资质图数组
    imag_url:""//资质图片信息
  },

/**
 * 资质图预览
 */
  imgYu: function (e) {
    //console.log(e)
    var src = e.currentTarget.dataset.src;//获取data-src
    var imgList = this.data.qualificationImag;//获取data-list

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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   console.log("资质图list:", JSON.parse(options.qualificationImag))
    if (options.qualificationImag && options.qualificationImag != "undefined") {
      this.setData({
        qualificationImag: JSON.parse(options.qualificationImag) //详情页数据
      });
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