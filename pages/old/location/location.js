// pages/location/location.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "", // 用户身份
    activeStation: 0, // 选中车站
    activeArea: 0, // 选中区域
    activeCompany: 0, // 选中公司
    pickerList: [ // 选择器内容
      {
        station: "武汉站1",
        area: ["月台1", "月台2", "月台3", "月台4"],
        company: ["永达传媒股份有限公司1", "永达传媒股份有限公司2", "永达传媒股份有限公司3", "永达传媒股份有限公司4"],
      },
      {
        station: "武汉站2",
        area: ["月台5", "月台6", "月台7", "月台8"],
        company: ["永达传媒股份有限公司5", "永达传媒股份有限公司6", "永达传媒股份有限公司7", "永达传媒股份有限公司8"],
      },
    ],
  },

  /**
   * 选择条件
   */
  selectChange(e){
    console.log(e);
    
    let group = e.currentTarget.dataset.group;
    let index = e.currentTarget.dataset.index;
    
    console.log("group", group)
    console.log("index", index)

    switch(group){
      case "station":
        console.log(1)
        this.setData({
          activeStation: index
        });
        break;
      case "area":
        console.log(2)
        this.setData({
          activeArea: index
        });
        break;
      case "company":
        console.log(3)
        this.setData({
          activeCompany: index
        });
        break;
    }
  },

  /**
   * 确认选择
   */
  confirm(){
    let pickerList = this.data.pickerList;
    let activeStation = this.data.activeStation;
    let activeArea = this.data.activeArea;
    let activeCompany = this.data.activeCompany;

    let station = pickerList[activeStation].station;
    let area = pickerList[activeStation].area[activeArea];
    let company = pickerList[activeStation].company[activeCompany];

    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      station,
      area,
      company
    });

    // 跳转到上一页
    wx.navigateBack({
      delta: 1
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = wx.getStorageSync("id");
    this.setData({
      id
    });
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