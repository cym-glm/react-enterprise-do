import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '@/store';
import './login.less';

export default function Login() {
  const navigate = useNavigate();
  const { login: setLogin } = useAuthStore();

  const onFinish = async (values: { username: string; password: string }) => {
    if (!values.username || !values.password) {
      message.error('请输入用户名和密码');
      return;
    }

    setLogin(values.password, {
      id: '1',
      loginname: values.username,
      avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${values.username}`,
      url: '',
      score: 100,
      create_at: new Date().toISOString(),
    });
    message.success('登录成功');
    navigate('/dashboard');
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
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="用户名"
              size="large"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
              size="large"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              icon={<LockOutlined />}
            >
              登录
            </Button>
          </Form.Item>
        </Form>
        <p className="login-tip">提示：任意用户名和密码均可登录</p>
      </Card>
    </div>
  );
}
