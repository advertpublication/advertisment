// Componet/Componet.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    propArray: {
      type: Array,
    },
    consArray: {
      type: Array,
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    selectShow: false,//初始option不显示
    nowText: "请选择审批流程",//初始内容
    conNowText: "请选择施工人",//初始内容
    animationData: {}//右边箭头的动画
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //option的显示与否
    selectToggle: function () {
      console.log("123");
      var nowShow = this.data.selectShow;//获取当前option显示的状态
      //创建动画
      var animation = wx.createAnimation({
        timingFunction: "ease"
      })
      this.animation = animation;
      if (nowShow) {
        animation.rotate(0).step();
        this.setData({
          animationData: animation.export()
        })
      } else {
        animation.rotate(180).step();
        this.setData({
          animationData: animation.export()
        })
      }
      this.setData({
        selectShow: !nowShow
      })

    },
  /**
  * 阻止蒙层下面页面滚动
  */
  preventTouchmove() {
    console.log("我是select里面的滑动方法")
  },
    //设置内容
    setText: function (e) {
      console.log(this.properties.consArray)
      if (this.properties.propArray.length!=0){
        var nowData = this.properties.propArray;
      } else if (this.properties.consArray.length != 0){
        var nowData = this.properties.consArray;
      }
     
      var nowIdx = e.target.dataset.index;//当前点击的索引
      if (this.properties.propArray.length != 0) {
        var nowText = nowData[nowIdx].approvalProcessName;//当前点击的内容
      } else {
        var conNowText = nowData[nowIdx].name;//当前点击的内容
      }
      
      //再次执行动画，注意这里一定，一定，一定是this.animation来使用动画
      this.animation.rotate(0).step();
      this.setData({
        selectShow: false,
        nowText: nowText,
        conNowText: conNowText,
        animationData: this.animation.export()
      })
      var nowDate = {
        id: nowData[nowIdx].id,
        text: nowText,
        conNowText: conNowText,
      }
      this.triggerEvent('myget', nowDate);
    }
  }
})