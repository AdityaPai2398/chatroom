import React, { Component } from 'react'
import { Spin, Input, Avatar, Icon,Button } from 'antd'
import Emoji from '../assets/emoji/Emoji.js'
import SublimeText from './SublimeText.jsx'
import RoomDetails from './RoomDetails.jsx'
import Highlight from 'react-syntax-highlighter'
import { tomorrowNightEighties } from 'react-syntax-highlighter/dist/styles';
import { inject, observer } from "mobx-react"
const colorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae','#712704','#04477c','#1291a9','#000','#036803'];
const emoji = Emoji.split(' ')

@inject("store")
@observer
export default class AsyncApp extends Component {
	constructor(props){
		super(props)
		this.state = {
			color: colorList,
			files:'',
			emojiClick:false,
			codingClick:true,
			size:0,
			type:"text",
			url:'send message',
		}
	}

	handleMsgSubmit = (e) => {
		//如果发的内容为空,退出函数
		//text && code && messageImage
		if(!e.text && !e.code && !e.image){return}
		this.props.store.socket({
			url: 'send message',
			userId: this.props.store.userId,
			myName: this.props.store.myName,
			nowRoom: this.props.store.nowRoom,
			myAvatorUrl: this.props.store.myAvatorUrl,
			//3种信息类型，文字，代码，图片
			text : e.text,
			code: e.code,
			image: e.image,
			type: e.type,
		})
		this._textInput.value = ''
		this.props.store.showCodeEditFunc(false)
	}

	handleImage = (e) => {
		let data = new FormData()
		data.append("smfile", e.target.files[0])
		fetch('https://sm.ms/api/upload', {
		  method: 'POST',
		  body: data
		}).then(
			response => response.json()
		).then(
			success => {
				this.handleMsgSubmit({
					image: success.data,
					type:'image'
				})
			}
		)
	}

	render() {
		const { match } = this.props
		const { nowRoomFunc , messagesList , doing , myName ,showEmoji , showEmojiFunc } = this.props.store;
		return (
			<div className='bodyContent'>
				<RoomDetails/>
				<div className='bodyContentMessages'>
					{messagesList.map((post, i) => (
						<div className={`bodyContentMessagesList ${post.userName==myName ? 'me' : 'other'}`} key={i}>
							<Avatar
								className='avator'
								style={{ 
									backgroundColor: this.state.color[post.userName.charCodeAt() % 8] 
								}}
								src={post.avatorUrl}
								size="large">{post.userName.split("")[0]}
							</Avatar>
							<div className='content'>
								<p className='messageTittle'>
									<span className='nameContainer'>
										{post.userName}
									</span>
									<span className="timeContainer">
										{post.createTime}
									</span>
								</p>
								{post.text && <p className = {`messageContainer ${post.type}`}>
									{post.text}
								</p>}
								{post.image ? <img 
									className = {`messageContainer ${post.type}`} 
									style={{
										width : post.image.width
									}}
									src = {post.image.url}/> : ''}
								{post.code ? <div className={`${post.type} messageContainer`}><Highlight 
									language='javascript'
									style={tomorrowNightEighties}
									className ="JavaScript">
									{post.code}
								</Highlight></div> : ''}
							</div>
						</div>
					))}
				</div>
				<div className="bodyContentFeature">
					<Icon className = 'emojiClick' id='emojiClick' type = 'smile-o'/>
					<div id="emojiContainer" className={showEmoji ? 'emojiContainer display' : 'emojiContainer none'}>
						{emoji.map((index,i)=>(
							<span key={i} className = "emoji">{index}</span>
						))}
					</div>
					<Icon className='picture' type="picture" onClick={()=>this._imageInput.click()}/>
					<input onChange={this.handleImage} 
						value={this.state.file} 
						ref={(c) => this._imageInput = c}
						id='imgInputFile'
						className='imgInputFile'
						type="file" />
					<span className = 'codingClick'>&lt;/></span>
					<SublimeText handleMsgSubmit={this.handleMsgSubmit}/>
				</div>
				<form className='bodyContentMessagesInputArea' onSubmit={(e)=>{
					e.preventDefault();
					this.handleMsgSubmit({
						type:'text',
						text:this._textInput.value
					})
				}}>
					<input 
						ref={(c) => this._textInput = c}
						className='bodyContentMessagesInput' 
						id='bodyContentMessagesInput' 
						placeholder='chat content' />
				</form>
			</div>
		)
	}
}