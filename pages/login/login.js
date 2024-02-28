// pages/login/login.js
wx.cloud.init()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: "/static/icon/默认头像.svg",
    nickname: "",
    name: "",
    tel: "",
    telstatue: "true",
    address: "",
    openId:"",
  },
  onChooseAvatar(e) {
    var {
      avatarUrl
    } = e.detail
    this.setData({
      avatarUrl,
    })
  },
  getnickname(e) {
    this.setData({
      nickname: e.detail.value
    })
    console.log(this.data.nickname)
  },
  getname(e) {
    this.setData({
      name: e.detail.value
    })
    console.log(this.data.name)
  },
  gettelephone(e) {
    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!myreg.test(e.detail.value)) {
      this.setData({
        telstatue: false
      })
    } else {
      this.setData({
        tel: e.detail.value,
        telstatue: true
      })
    }
  },
  getlocalpath(e) {
    var that = this
    console.log(1111)
    wx.chooseLocation({
      success(res) {
        console.log(res)
        that.setData({
          address: res.address
        })
      }
    })
  },
  login(e) {
    var that = this
    var warning = ""
    if (!this.data.nickname) {
      warning = "昵称未填写"
    } else if (!this.data.name) {
      warning = "姓名未填写"
    } else if (!this.data.telstatue) {
      warning = "电话格式错误"
    }

    if (warning) {
      wx.showToast({
        title: warning,
        icon: 'none',
        duration: 5000
      })
    } else {
      db.collection('uinfo').add({
          data: {
            nickname: that.data.nickname,
            name: that.data.name,
            telphone: that.data.tel,
            openId:that.data.openId
          }
        })
        .then(res => {
          //成功的处理
          wx.switchTab({
            url: '/pages/exhibit/exhibit',
          })
        }).catch(err => {
          wx.showToast({
            title: '异常',
          })
        })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    var that = this
    wx.cloud.callFunction({
      name: 'getid',
      data: {
        message: 'helloCloud',
      }
    }).then(res => {
      // console.log(res.result.userInfo.openId)
      var openId = res.result.userInfo.openId
      that.setData({
        openId:openId
      })
      console.log(openId)
      const _ =db.command
      db.collection('uinfo').where({
          openId:openId
        })
        .get({
          success:function(res){
            if (res.data[0].openId==openId){
              wx.showToast({
                title: "登录成功",
                icon: 'success',
                duration: 2000,
                success: function () {
                  setTimeout(function () {
                    wx.switchTab({
                      url: '/pages/exhibit/exhibit',
                    })
                  }, 2000)
                }
              })
            }
            // else{
            //   wx.cloud.init()
            //   const db = wx.cloud.database()
            //   db.collection('uid').add({
            //     data:{
            //       openId: openId
            //     }
            //   })
            // }
          },
        })
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})