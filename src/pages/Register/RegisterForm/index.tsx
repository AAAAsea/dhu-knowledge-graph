import { LockOutlined, UserOutlined, SafetyOutlined, MobileOutlined } from '@ant-design/icons'
import { Button, Form, Input, message  } from 'antd'
import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import './index.less'
import request from '@/utils/request'

const RegisterForm: React.FC = () => {
    const [codeImg, setCodeImg ] = useState('')
    const navigate = useNavigate()

    let initCodeFlag = false;
    useEffect(()=>{
        if(!initCodeFlag)
            initCodeImg()
        initCodeFlag = true;
    }, [])
    const initCodeImg = ()=>{
        request.get('/user/verifyCode',{
            responseType: 'arraybuffer'
        })
        .then((res)=>{
            setCodeImg('data:image/png;base64,' + btoa(String.fromCharCode(...new Uint8Array(res))))
        })
    }
    const onFinish = (values: any) => {
        request.post('/user/proRegister',values,{
            params: values
        })
        .then(res=>{
            if(res.code === 0)
            {
                message.success(res.msg)
                navigate('/login')
            }else{
                initCodeImg();
                message.error(res.msg)
            }
        })
    }

    return (
        <Form
            name="normal_login"
            className="login-form"
            initialValues={{
                remember: true,
            }}
            onFinish={onFinish}
        >
            <Form.Item
                name="userName"
                rules={[
                    {
                        required: true,
                        message: '请输入用户昵称！',
                    },
                    {
                        pattern: /^\S{2,9}$/,
                        message: '长度应为2-9个字符！',
                    },
                ]}
            >
                <Input
                    prefix={<UserOutlined className="site-form-item-icon" />}
                    placeholder="用户昵称"
                />
            </Form.Item>
            <Form.Item
                name="mobile"
                rules={[
                    {
                        required: true,
                        message: '请输入手机号！',
                    },
                    {
                        pattern: /^1[3456789]\d{9}$/,
                        message: '手机号格式错误！',
                    },
                ]}
            >
                <Input
                    prefix={<MobileOutlined className="site-form-item-icon" />}
                    placeholder="手机号"
                />
            </Form.Item>
            <Form.Item
                name="password"
                rules={[
                    {
                        required: true,
                        message: '请输入密码！',
                    },
                    {
                        pattern: /^[a-zA-Z]\w{5,17}$/,
                        message: '以字母开头，长度在6~18之间，只能包含字母、数字和下划线！',
                    },
                ]}
            >
                <Input
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="密码"
                />
            </Form.Item>

            <Form.Item
                name="rePassword"
                rules={[
                    {
                        required: true,
                        message: '请确认密码！',
                    },
                    ({ getFieldValue }) => ({
                        validator(rule, value) {
                            if (!value || getFieldValue('password') === value) {
                                return Promise.resolve()
                            }
                            return Promise.reject('两次密码输入不一致')
                        },
                    }),
                ]}
            >
                <Input
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password_"
                    placeholder="确认密码"
                />
            </Form.Item>

            <div id="vefifyCode">
                <Form.Item
                    name="vercode"
                    rules={[
                        {
                            required: true,
                            message: '请确认验证码！',
                        },
                    ]}  
                >
                    <Input
                        prefix={<SafetyOutlined className="site-form-item-icon" />}
                        placeholder="验证码"
                    />
                </Form.Item>
                <img style={{height: '32px', cursor: 'pointer'}} onClick={initCodeImg} src={codeImg}/>
            </div>
            <Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    className="login-form-button"
                    style={{marginRight: '20px'}}
                >
                    注册
                </Button>
                <NavLink
                    to="/login"
                    className={({ isActive }) => (isActive ? 'current' : '')}
                >
                    返回登录
                </NavLink>
            </Form.Item>
        </Form>
    )
}

export default RegisterForm
