import { Table, Input, Button, Space, Popconfirm, message, Card, Modal, Form, Select, Tag } from 'antd';
import { SearchOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useState, useEffect, useRef } from 'react';
import { getTopics, createTopic } from '@/api/topic';
import type { Topic } from '@/types';

export default function Topic() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const fetchTopics = useRef(async (page: number, pageSize: number) => {
    setLoading(true);
    try {
      const response = await getTopics({ page, limit: pageSize });
      if (response.success) {
        const data = response.data as unknown as Topic[];
        setTopics(data || []);
        setPagination({
          current: page,
          pageSize,
          total: (data || []).length ? 100 : 0,
        });
      }
    } catch (error) {
      console.error('获取话题列表失败:', error);
      message.error('获取话题列表失败');
    } finally {
      setLoading(false);
    }
  });

  useEffect(() => {
    fetchTopics.current(pagination.current, pagination.pageSize);
  }, []);

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleDelete = (id: string) => {
    setTopics((prev) => prev.filter((topic) => topic.id !== id));
    message.success('删除成功');
  };

  const handleEdit = (record: Topic) => {
    message.info(`编辑话题: ${record.title}`);
  };

  const handleAdd = () => {
    setModalVisible(true);
  };

  const handleSubmit = async (values: { title: string; tab: string; content: string }) => {
    try {
      const response = await createTopic(values);
      if (response.success) {
        message.success('新增话题成功');
        setModalVisible(false);
        form.resetFields();
        fetchTopics.current(pagination.current, pagination.pageSize);
      } else {
        message.error(response.error_msg || '新增话题失败');
      }
    } catch (error) {
      console.error('新增话题失败:', error);
      message.error('新增话题失败');
    }
  };

  const filteredTopics = topics.filter((topic) =>
    topic.title.toLowerCase().includes(searchText.toLowerCase())
  );

  const getTabLabel = (tab: string) => {
    const tabs: Record<string, string> = {
      good: '精华',
      share: '分享',
      ask: '问答',
      job: '招聘',
      dev: '开发',
    };
    return tabs[tab] || tab;
  };

  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: '标签',
      dataIndex: 'tab',
      key: 'tab',
      width: 100,
      render: (tab: string) => (
        <Tag color={tab === 'good' ? 'red' : tab === 'share' ? 'green' : tab === 'ask' ? 'blue' : 'orange'}>
          {getTabLabel(tab)}
        </Tag>
      ),
    },
    {
      title: '作者',
      dataIndex: 'author',
      key: 'author',
      width: 120,
      render: (author: { loginname: string; avatar_url: string }) => (
        <Space>
          <img
            src={author.avatar_url}
            alt="avatar"
            style={{ width: 24, height: 24, borderRadius: '50%' }}
          />
          <span>{author.loginname}</span>
        </Space>
      ),
    },
    {
      title: '回复数',
      dataIndex: 'reply_count',
      key: 'reply_count',
      width: 80,
    },
    {
      title: '浏览数',
      dataIndex: 'visit_count',
      key: 'visit_count',
      width: 80,
    },
    {
      title: '创建时间',
      dataIndex: 'create_at',
      key: 'create_at',
      width: 150,
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: unknown, record: Topic) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除该话题？"
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
        title="话题管理"
        extra={
          <Space>
            <Input.Search
              placeholder="搜索标题"
              allowClear
              enterButton={<SearchOutlined />}
              style={{ width: 200 }}
              onSearch={handleSearch}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              新增话题
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={filteredTopics}
          rowKey="id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
            onChange: (page, pageSize) => {
              setPagination((prev) => ({ ...prev, current: page, pageSize }));
              fetchTopics.current(page, pageSize);
            },
          }}
        />
      </Card>

      <Modal
        title="新增话题"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="title"
            label="标题"
            rules={[{ required: true, message: '请输入标题' }]}
          >
            <Input placeholder="请输入话题标题" />
          </Form.Item>
          <Form.Item
            name="tab"
            label="分类"
            rules={[{ required: true, message: '请选择分类' }]}
          >
            <Select placeholder="请选择分类">
              <Select.Option value="share">分享</Select.Option>
              <Select.Option value="ask">问答</Select.Option>
              <Select.Option value="job">招聘</Select.Option>
              <Select.Option value="dev">开发</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="content"
            label="内容"
            rules={[{ required: true, message: '请输入内容' }]}
          >
            <Input.TextArea rows={4} placeholder="请输入话题内容" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button onClick={() => setModalVisible(false)}>取消</Button>
              <Button type="primary" htmlType="submit">
                确定
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
