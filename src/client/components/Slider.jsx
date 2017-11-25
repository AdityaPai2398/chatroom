import React, { Component } from 'react'
import {
	Link
} from 'react-router-dom'
import { Avatar, Icon, Badge } from 'antd'
import { inject, observer } from "mobx-react"

@inject("store")
@observer
export default class Chat extends Component {
	add_group = (e) => {
		const {
			myInfo,
			is_show_create_group_input_func
		} = this.props.store
		e.preventDefault()
		is_show_create_group_input_func(false)
		this.props.store.socket({
			url: 'create group',
			user_id: myInfo.user_id,
			group_name: this.creat_group_input.value
		})
	}
	render() {
		const { match } = this.props
		const {
			onlineUsers,
			myInfo,
			is_show_create_group_input
		} = this.props.store;
		return (
			<div className="slider">
				<div className='myInfo'>
					<Badge dot className='online'>
						<Avatar
							src={myInfo.github.avatar_url}
							id="showMoreUserInfo"
							className="myAvatar"
							shape="square"
							size="large" />
					</Badge>
					<span className="myName">{myInfo.github.name}</span>
				</div>
				{myInfo.groups.map((group, i) => (
					<Link
						className={`groupList ${group.group_name == decodeURIComponent(location.pathname.split('/')[location.pathname.split('/').length - 1]) ? "active" : ""}`}
						id={group.group_name}
						key={i}
						to={`${match.url}/${group.group_name}`}>
						<Avatar
							src={group.avatar_url}
							size="large"
							className="slideAvatar"
							shape="square" />
						<span className="groupName">{group.group_name}</span>
					</Link>
				))}
				{
					myInfo.user_id && <span onClick={this.toggle} className="addgroup" id='addgroup'>
						<Icon type="usergroup-add" />
						{is_show_create_group_input ? <form className="form" onSubmit={this.add_group}>
							<input
								ref={(c) => this.creat_group_input = c}
								placeholder='enter' className="input" id='input' type='text' />
						</form> : 'create group'}
					</span>
				}
			</div>
		)
	}
};
