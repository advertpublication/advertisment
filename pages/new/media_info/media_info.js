Page({
  data: {
    listData: []//媒体资源信息
  },
  onLoad: function (options) {
   // console.log("媒体详情列表:", JSON.parse(options.dwAdvertinstallresourceList));
    if (options.dwAdvertinstallresourceList && options.dwAdvertinstallresourceList != "undefined") {
      this.setData({
        listData: JSON.parse(options.dwAdvertinstallresourceList) //详情页数据
      });
    }
    
  }

})