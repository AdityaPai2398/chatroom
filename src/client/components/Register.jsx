import { Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete } from 'antd';
import React from 'react'
import { Link ,Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
	fetchPostsIfNeeded,
	inputSubreddit
} from '../actions'


const FormItem = Form.Item;

class Registrat extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			url:'/register',
		}
    }

    handleSubmit = (e) => {
        e.preventDefault();
        if(!this.state.userName){
            alert("请输入用户名")
        }else if(!this.state.passWord){
            alert("请输入密码")
        }else{
            const { dispatch } = this.props
		    dispatch(inputSubreddit(this.state))
	    	dispatch(fetchPostsIfNeeded(this.state))
        }
    }
    
    onNameChange = (e) => {
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
        const { posts,isFetching } = this.props
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 14 }
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 14,
                    offset: 10
                },
                sm: {
                    span: 14,
                    offset: 11
                }
            }
        }
    
        return (
            <Form onSubmit={this.handleSubmit}  className="register-form">
                {posts && posts.code==0  ? document.cookie='token='+posts.token : '' }
                {posts && posts.code==0  ? document.cookie='userName='+posts.userName : '' }
                {posts && posts.code==0  ? document.cookie='avatorUrl='+posts.avatorUrl : '' }
                <h1>{ posts && posts.code==0  ? <Redirect to='/chat'/> : (posts.message=='请登陆' ? '请注册' :posts.message ) }</h1>
                <FormItem {...formItemLayout} label="用户名" hasFeedback>
                    <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} onChange={this.onNameChange}/>
                </FormItem>
                <FormItem {...formItemLayout} label="密码" hasFeedback>
                    <Input 
                        prefix={<Icon type="lock" 
                        style={{ fontSize: 13 }} />} 
                        onChange={this.onPassWordChange} 
                        type="password" />
                </FormItem>
                <FormItem {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">注册</Button>
                    Or <Link to="/">登陆</Link>
                </FormItem>
            </Form>
        );
    }
}


function mapStateToProps(state) {
	const { inputSubreddit, postsBySubreddit } = state
	const {
		isFetching,
		items: posts
	} = postsBySubreddit[inputSubreddit] || {
		items: [],
		isFetching:true
	}
	return {
		inputSubreddit,
		isFetching,
		posts
	}
}

export default connect(mapStateToProps)(Registrat)