// import 'virtual:prefetch';
import { Table, Input, Button, Space, Popconfirm, message, Card } from 'antd';
import { SearchOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useState, useEffect, useRef } from 'react';
import { getUsers } from '@/api/user';
import type { UserInfo } from '@/types';
export default function User() {
    const [users, setUsers] = useState<UserInfo[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    const fetchUsers = useRef(async (page: number, pageSize: number) => {
        setLoading(true);
        try {
            const response = await getUsers(page, pageSize);
            if (response.success) {
                setUsers(response.data || []);
                setPagination({
                    current: page,
                    pageSize,
                    total: response.data?.length ? 100 : 0,
                });
            }
        } catch (error) {
            console.error('获取用户列表失败:', error);
            message.error('获取用户列表失败');
        } finally {
            setLoading(false);
        }
    });

    useEffect(() => {
        fetchUsers.current(pagination.current, pagination.pageSize);
    }, []);

    const handleSearch = (value: string) => {
        setSearchText(value);
    };

    const handleDelete = (id: string) => {
        setUsers((prev) => prev.filter((user) => user.id !== id));
        message.success('删除成功');
    };

    const handleEdit = (record: UserInfo) => {
        message.info(`编辑用户: ${record.loginname}`);
    };

    const filteredUsers = users.filter((user) => user.loginname.toLowerCase().includes(searchText.toLowerCase()));

    const columns = [
        {
            title: '头像',
            dataIndex: 'avatar_url',
            key: 'avatar_url',
            width: 80,
            render: (url: string) => (
                <img src={url} alt="avatar" style={{ width: 40, height: 40, borderRadius: '50%' }} />
            ),
        },
        {
            title: '用户名',
            dataIndex: 'loginname',
            key: 'loginname',
            filterSearch: true,
        },
        {
            title: '积分',
            dataIndex: 'score',
            key: 'score',
            width: 100,
        },
        {
            title: '注册时间',
            dataIndex: 'create_at',
            key: 'create_at',
            width: 150,
            render: (date: string) => new Date(date).toLocaleDateString(),
        },
        {
            title: '操作',
            key: 'action',
            width: 150,
            render: (_: unknown, record: UserInfo) => (
                <Space>
                    <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
                        编辑
                    </Button>
                    <Popconfirm
                        title="确定删除该用户？"
                        onConfirm={() => handleDelete(record.id)}
                        okText="确定"
                        cancelText="取消"
                    >
                        <Button type="link" danger icon={<DeleteOutlined />}>
                            删除
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Card
                title="用户管理"
                extra={
                    <Space>
                        <Input.Search
                            placeholder="搜索用户名"
                            allowClear
                            enterButton={<SearchOutlined />}
                            style={{ width: 200 }}
                            onSearch={handleSearch}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                        <Button type="primary">添加用户</Button>
                    </Space>
                }
            >
                <Table
                    columns={columns}
                    dataSource={filteredUsers}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        ...pagination,
                        showSizeChanger: true,
                        showTotal: (total) => `共 ${total} 条`,
                        onChange: (page, pageSize) => {
                            setPagination((prev) => ({ ...prev, current: page, pageSize }));
                            fetchUsers.current(page, pageSize);
                        },
                    }}
                />
            </Card>
        </div>
    );
}
