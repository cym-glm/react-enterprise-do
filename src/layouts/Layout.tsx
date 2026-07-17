import { Layout } from 'antd';
import Sidebar from './Sidebar';
import HeaderComponent from './Header';

const { Content } = Layout;

interface LayoutProps {
  children: React.ReactNode;
}

export default function LayoutComponent({ children }: LayoutProps) {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar />
      <Layout style={{ marginLeft: 200, transition: 'margin-left 0.3s' }}>
        <HeaderComponent />
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: '#f0f2f5',
            borderRadius: 8,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
