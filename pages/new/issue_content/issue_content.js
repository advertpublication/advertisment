
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imag_urls:[]//点位图片url
  },

  /**
 * 资质图预览
 */
  imgYu: function (e) {
    //coon/////././////console.log(this.data.imag_urls)
    var src = e.currentTarget.dataset.src;//获取data-src
    let imgList=[]
    for (var index in this.data.imag_urls) {
      imgList[index] = this.data.imag_urls[index].fileName
    }
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
    console.log(JSON.parse(options.cmMediaImgList))
    if (options.cmMediaImgList && options.cmMediaImgList != "undefined") {
      this.setData({
        imag_urls: JSON.parse(options.cmMediaImgList)
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