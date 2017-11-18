import { action, useStrict, computed, observable } from "mobx";
import io from 'socket.io-client';
import config from '../../../config/project.js'

const socket = io.connect({ secure: true });
// const socket = io();

class List {
  @observable message
  @observable time
  @observable userName
  @observable avatar_url
  constructor(e) {
    this.message = e.message
    this.time = e.time
    this.userName = e.userName
    this.avatar_url = e.avatar_url
  }
}
class User {
  @observable userName
  @observable avatar_url
  constructor(e) {
    this.userName = e.userName
    this.avatar_url = e.avatar_url
  }
}
// useStrict(true)
class TodoStore {
  //我的用户信息
  @observable myInfo = {
    _id: '',
    github:{
      name:'',
      avatar_url:''
    },
    groups: []
  }
  //当前房间信息
  @observable group = {
    id: '',
    name: '',
    avatar_url: '',
    creator: '',
    //管理员信息
    administratorList: [],
    //成员信息
    memberList: [],
    messageList: []
  }
  //是否显示用户详细信息
  @observable showRoomDetail = false
  //是否显示表情容器
  @observable showEmoji = false
  //是否显示代码编辑器
  @observable showCodeEdit = false
  //是否显示用户信息详情
  @observable showMoreUserInfo = {
    isShow: false,
    x: 0,
    y: 0,
    github:{
      name: '',
      avatar_url: ''
    }
  }
  @observable code = ''
  @observable messageType = 'text'
  //当前在线用户
  @observable onlineUsers = []
  @observable doing = false
  //登陆/注册用户返回信息提示
  @observable tip = '请登录'
  //登陆/注册用户返回总体json
  @observable callBack = {}
  //封装好的socket.emit
  @action socket = (state) => {
    socket.emit(state.url, state)
  }
  @action tipFunc = (state) => {
    this.tip = state
  }
  @action groupFunc = (state) => {
    this.group.name = state
  }
  @action showRoomDetailFunc = (state) => {
    this.showRoomDetail = state
  }
  @action showCodeEditFunc = (state) => {
    this.showCodeEdit = state
  }
  @action showEmojiFunc = (state) => {
    this.showEmoji = state
  }
  @action showMoreUserInfoFunc = (state) => {
    this.showMoreUserInfo = state
  }
  //写了一个通用mobx函数。。。希望能用。。。。。
  @action allHold = (left, right) => {
    if (left.split('.').length == 1) {
      this[left] = right
    } else if (left.split('.').length == 2) {
      this[
        left.split('.')[0]
      ][
        left.split('.')[1]
      ] = right
    } else if (left.split('.').length == 3) {
      this[left.split('.')[0]][
        left.split('.')[1]
      ][
        left.split('.')[2]
      ] = right
    }
  }
  constructor() {
    socket.on('get myInfo', json => {
      console.log('这个时候，我获得了我的个人信息，看看谁比我快，我必须要第一快',json);
      this.myInfo = json
    })
    socket.on('get users', json => {
      this.onlineUsers = json
    })
    socket.on('init group', json => {
      this.group = json
    })

    socket.on('send message', json => {
      this.group.messageList.push(json)
    })

    socket.on('add room', json => {
      // if (json.code == 0) {
      //   console.log(json.message)
      // } else {
      //   this.roomList.push(json)
      // }
    })

    socket.on('user detail', json => {
      console.log("user detail",json);
      //只能一个一个获取，不然会改变 showmoreuserinfo 的框框xy坐标位置。
      this.showMoreUserInfo.github = json.github
      this.showMoreUserInfo.groups = json.groups
      this.showMoreUserInfo.friends = json.friends
      this.showMoreUserInfo._id = json._id
    })
  }
}
window.store = new TodoStore
var store = window.store
export default store
