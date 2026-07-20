import { Layout, Avatar, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { UserOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import useAuthStore from '@/store';
import { useNavigate } from 'react-router-dom';

const { Header } = Layout;

export default function HeaderComponent() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
      logout();
      navigate('/login');
  };

  const items: MenuProps['items'] = [
      {
          key: '1',
          icon: <SettingOutlined />,
          label: '个人设置',
      },
      {
          key: '2',
          icon: <LogoutOutlined />,
          label: '退出登录',
          onClick: handleLogout,
      },
  ];

  return (
    <Header
      style={{
        padding: '0 24px',
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        boxShadow: '0 1px 4px rgba(0, 21, 41, 0.08)',
      }}
    >
      <Dropdown menu={{ items }}>
        <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <Avatar size="small" icon={<UserOutlined />} src={user?.avatar_url} />
          <span style={{ marginLeft: 8 }}>{user?.loginname || '用户'}</span>
        </div>
      </Dropdown>
    </Header>
  );
}
