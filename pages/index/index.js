// index.js
// 获取应用实例
const salarys = require('./salary')

const app = getApp()

Page({
  data: {
    array: ["事假", "病假", "探亲假", "年休假", "生育类假期", "丧家及其他假别", "工伤假", "旷工"],
    objectArray: [{
      id: 0,
      name: '事假'
    }, {
      id: 1,
      name: '病假'
    }, {
      id: 2,
      name: '探亲假'
    }, {
      id: 3,
      name: '年休假'
    }, {
      id: 4,
      name: '生育类假期'
    }, {
      id: 5,
      name: '丧家及其他假别'
    }, {
      id: 6,
      name: '工伤假'
    }, {
      id: 7,
      name: '旷工'
    }],
    index: 0,
    amount: 0,
    days: 0,
    salaryPart: ["技能", "岗位", "岗资", "效益", "技贴", "知老补", "年功", "考奖", "地贴", "技师", "岗贴", "误餐", "岗生奖", "甘宁补", "女卫", "工长", "奖励", "安责", "安责1", "经营业绩", "施工", "夜餐", "加班", "艰贴", "河差", "一线", "安标", "岗安绩效", "绩效考核", "技术激励奖", "取暖费", "得1", "应得", "税金", "房积", "养老", "失保", "医保", "年金"],
    salarysParsed: [],
    map: {
      0: (days, salary) => {
        console.log(salary);
        return (salary["技能"] + salary["岗位"] + salary["女卫"] + salary["岗资"] + salary["劳模"] + salary["知老补"] + salary["地贴"] + salary["甘宁补"] + salary["岗贴"] + salary["技术激励奖"] + salary["一线"] + salary["安标"] + salary["岗生奖"] + salary["岗安绩效"] + salary["技师"] + salary["工龄"]) * days / 21.75
      },
      1: (days, salary) => {
        const overLine = (salary['岗位'] / 21.75) * days > 155

        if (overLine) {
          return (salary["艰贴"] + salary["岗贴"] + salary["技贴"] + salary["技术激励奖"] + salary["一线"] + salary["安标"] + salary["岗生奖"] + salary["岗安绩效"] + salary["技师"]) * days / 21.75
        }
        return (salary["岗位工资"] - 155 + salary["在岗岗资"] - 3593 + salary["技能"] + salary["艰贴"] + salary["岗贴"] + salary["技贴"] + salary["技术激励奖"] + salary["一线"] + salary["安标"] + salary["岗生奖"] + salary["岗安绩效"] + salary["技师"]) * days / 21.75
      },
      2: (days, salary) => {
        return (salary["技师"] + salary["岗安绩效"] + salary["岗生奖"] + salary["安标"] + salary["技术激励奖"] + salary["一线"] + salary["技贴"] + salary["岗贴"] + salary["艰贴"]) * days / 21.75
      },
      3: (days, salary) => {
        return salary['岗安绩效'] * days / 21.75
      },
      4: (days, salary) => {
        return (salary["艰贴"] + salary["岗贴"] + salary["技术激励奖"] + salary["技贴"] + salary["岗安绩效"] + salary["技师"]) * days / 21.75
      },
      5: (days, salary) => {
        console.log(salary);
        return (salary["技师"] + salary["岗安绩效"] + salary["岗生奖"] + salary["安标"] + salary["一线"] + salary["技贴"] + salary["技术激励奖"] + salary["岗贴"] + salary["艰贴"]) * days / 21.75
      },
      6: (days, salary) => {
        return -1;
      },
      7: (days, salary) => {
        return -1;
      },
    },
    tip: '',
    btnDisable: false,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName') // 如需尝试获取用户信息可改为false
  },
  bindPickerChange(e) {
    this.setData({
      index: e.detail.value
    })
    if (e.detail.value === 6) {
      this.setData({
        btnDisable: true,
        tip: '工伤期间工资待遇依照工伤保险条例执行'
      })
    } else if (e.detail.value === 7) {
      this.setData({
        btnDisable: true,
        tip: '对连续旷工时间超过15天的人员停发工资及各类津补贴，待作出处理决定后，按决定执行；对于发生暂停劳动合同履行的人员，暂停劳动合同履行期间停发工资及各类津补贴。'
      })
    } else {
      this.setData({
        btnDisable: false,
        tip: ''
      })
    }
  },
  // 事件处理函数
  bindCalcTap() {
    const amount = this.data.map[this.data.index](this.data.days, this.data.salarysParsed[0]);
    this.setData({
      amount: amount.toFixed(2)
    })
  },
  onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
    this.setData({
      salarysParsed: salarys.map(s => {
        const o = {};
        for (const [key, value] of Object.entries(s)) {
          if (key === '姓名') {
            continue;
          }
          o[key] = parseFloat(value);
        }
        return o
      })
    })
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})