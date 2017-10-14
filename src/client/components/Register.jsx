import { Input, Icon, Button } from 'antd';
import React from 'react'
import { Link ,Redirect } from 'react-router-dom'
import { inject, observer } from "mobx-react"

@inject("store")
@observer
class Registrat extends React.Component {
		constructor(props){
			super(props);
			this.state = {
				url:'login',
        type: 'register',
			}
    }
    componentDidMount(e) {
        this.props.store.tipFunc("请注册")
        this._input.focus();
    }
    handleSubmit = (e) => {
        e.preventDefault();
        if(!this.state.userName){
            this.props.store.tipFunc("用户名不能为空")
        }else if(!this.state.passWord){
            this.props.store.tipFunc("密码不能为空")
        }else{
            this.props.store.socket(this.state)
        }
    }
    onUserNameChange = (e) => {
        this.setState({
            userName:e.target.value
        })
    }
    onPassWordChange = (e) => {
        this.setState({
            passWord:e.target.value
        })
    }
    render() {
        const { tip } = this.props.store
        return (
            <form onSubmit={this.handleSubmit}  className="register-form">
                <h1 className = 'header'>
                    &nbsp;
                    {tip }
                </h1>
                <div className="userName">
                    <Icon className="prefix" type="user" style={{ fontSize: 13 }} />
                    <input id="userName"
                        ref={ (c)=> this._input = c }
                        onChange={this.onUserNameChange}
                        placeholder="用户名" />
                </div>
                <div className="passWord">
                    <Icon className="prefix" type="lock" style={{ fontSize: 13 }} />
                    <input
                        onChange={this.onPassWordChange}
                        type="password"
                        placeholder="Password" />
                </div>
                <div className = 'button'>
                    <Button type="primary" htmlType="submit">注册</Button>
                    Or <Link to="/">登陆</Link>
                </div>
            </form>
        );
    }
}
export default Registrat
