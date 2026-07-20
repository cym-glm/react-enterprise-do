import { Table, Card, Tag, Button, Space, Popconfirm, message } from 'antd';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { debounce } from 'lodash-es';
interface Order {
    id: string;
    orderNo: string;
    customer: string;
    amount: number;
    status: 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled';
    createTime: string;
}

const statusMap: Record<Order['status'], string> = {
  pending: '待支付',
  paid: '已支付',
  shipped: '已发货',
  completed: '已完成',
  cancelled: '已取消',
};

const statusColorMap: Record<Order['status'], string> = {
  pending: 'warning',
  paid: 'processing',
  shipped: 'blue',
  completed: 'success',
  cancelled: 'error',
};

const mockOrders: Order[] = [
  {
    id: '1',
    orderNo: 'ORD20240101001',
    customer: '张三',
    amount: 299.0,
    status: 'paid',
    createTime: '2024-01-01 10:00:00',
  },
  {
    id: '2',
    orderNo: 'ORD20240101002',
    customer: '李四',
    amount: 599.0,
    status: 'shipped',
    createTime: '2024-01-01 11:00:00',
  },
  {
    id: '3',
    orderNo: 'ORD20240101003',
    customer: '王五',
    amount: 199.0,
    status: 'pending',
    createTime: '2024-01-01 12:00:00',
  },
  {
    id: '4',
    orderNo: 'ORD20240101004',
    customer: '赵六',
    amount: 899.0,
    status: 'completed',
    createTime: '2024-01-01 13:00:00',
  },
  {
    id: '5',
    orderNo: 'ORD20240101005',
    customer: '钱七',
    amount: 399.0,
    status: 'cancelled',
    createTime: '2024-01-01 14:00:00',
  },
];

export default function Order() {
    // console.log('---', debounce());
    const [orders, setOrders] = useState<Order[]>(mockOrders);

    const handleDelete = (id: string) => {
        setOrders((prev) => prev.filter((order) => order.id !== id));
        message.success('删除成功');
    };

    const handleEdit = (record: Order) => {
        message.info(`编辑订单: ${record.orderNo}`);
    };

    const handleView = (record: Order) => {
        message.info(`查看订单: ${record.orderNo}`);
    };

    const columns = [
        {
            title: '订单编号',
            dataIndex: 'orderNo',
            key: 'orderNo',
            width: 180,
        },
        {
            title: '客户',
            dataIndex: 'customer',
            key: 'customer',
            width: 100,
        },
        {
            title: '金额',
            dataIndex: 'amount',
            key: 'amount',
            width: 120,
            render: (amount: number) => `¥${amount.toFixed(2)}`,
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status: Order['status']) => <Tag color={statusColorMap[status]}>{statusMap[status]}</Tag>,
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            width: 180,
        },
        {
            title: '操作',
            key: 'action',
            width: 200,
            render: (_: unknown, record: Order) => (
                <Space>
                    <Button type="link" icon={<EyeOutlined />} onClick={() => handleView(record)}>
                        查看
                    </Button>
                    <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
                        编辑
                    </Button>
                    <Popconfirm
                        title="确定删除该订单？"
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
            <Card title="订单管理" extra={<Button type="primary">创建订单</Button>}>
                <Table
                    columns={columns}
                    dataSource={orders}
                    rowKey="id"
                    pagination={{
                        showSizeChanger: true,
                        showTotal: (total) => `共 ${total} 条`,
                    }}
                />
            </Card>
        </div>
    );
};