import { Form, Input, Button, Card, message, Radio } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useAuthStore from '@/store';
import { login } from '@/api/login';
import './login.less';

type LoginMode = 'user' | 'token';

export default function Login() {
    const navigate = useNavigate();
    const { login: setLogin } = useAuthStore();
    const [mode, setMode] = useState<LoginMode>('user');

    const onFinish = async (values: { username: string; password: string }) => {
        if (!values.username) {
            message.error('请输入用户名或Token');
            return;
        }

        if (mode === 'token') {
            try {
                const response = await login({ accesstoken: values.username });
                if (response.success) {
                    setLogin(values.username, response.data);
                    message.success('登录成功');
                    navigate('/dashboard');
                } else {
                    message.error(response.error_msg || 'Token无效');
                }
            } catch (error) {
                message.error('登录失败，请检查网络');
            }
        } else {
            setLogin(values.password || '', {
                id: '1',
                loginname: values.username,
                avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${values.username}`,
                url: '',
                score: 100,
                create_at: new Date().toISOString(),
            });
            message.success('登录成功');
            navigate('/dashboard');
        }
    };

    return (
        <div className="login-page">
            <Card className="login-card">
                <div className="login-header">
                    <h2>企业管理系统</h2>
                    <p>欢迎登录</p>
                </div>
                <Form
                    name="login"
                    initialValues={{ username: '', password: '' }}
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item>
                        <Radio.Group value={mode} onChange={(e) => setMode(e.target.value)}>
                            <Radio value="user">用户名登录</Radio>
                            <Radio value="token">Token登录</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: mode === 'token' ? '请输入Token' : '请输入用户名' }]}
                    >
                        <Input
                            prefix={mode === 'token' ? <LockOutlined /> : <UserOutlined />}
                            placeholder={mode === 'token' ? 'CNodeJS Token' : '用户名'}
                            size="large"
                        />
                    </Form.Item>
                    {mode === 'user' && (
                        <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
                            <Input.Password prefix={<LockOutlined />} placeholder="密码" size="large" />
                        </Form.Item>
                    )}
                    <Form.Item>
                        <Button type="primary" htmlType="submit" size="large" block icon={<LockOutlined />}>
                            登录
                        </Button>
                    </Form.Item>
                </Form>
                <p className="login-tip">
                    {mode === 'token' ? '提示：输入CNodeJS的accessToken进行真实登录' : '提示：任意用户名和密码均可登录'}
                </p>
            </Card>
        </div>
    );
}
