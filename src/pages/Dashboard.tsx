import { Card, Row, Col, Statistic } from 'antd';
import {
  UserOutlined,
  ShoppingCartOutlined,
  MessageOutlined,
  ArrowUpOutlined,
} from '@ant-design/icons';
import { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import { getTopics } from '@/api/topic';
import type { Topic } from '@/types';
import './dashboard.less';

export default function Dashboard() {
  const chartRef = useRef<HTMLDivElement>(null);
  const pieChartRef = useRef<HTMLDivElement>(null);
  const [topicCount, setTopicCount] = useState(0);
  const [topics, setTopics] = useState<Topic[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getTopics({ page: 1, limit: 50 });
        if (response.success) {
          const data = response.data as unknown as Topic[];
          setTopics(data || []);
          setTopicCount((data || []).length > 0 ? 1000 : 1000);
        }
      } catch (error) {
        
        setTopicCount(1000);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (chartRef.current) {
      const chart = echarts.init(chartRef.current);
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          data: ['1月', '2月', '3月', '4月', '5月', '6月'],
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            name: '用户数',
            type: 'bar',
            data: [1200, 1320, 1010, 1340, 1900, 2300],
            itemStyle: {
              color: '#1890ff',
            },
          },
          {
            name: '订单数',
            type: 'bar',
            data: [2200, 1820, 1910, 2340, 2900, 3300],
            itemStyle: {
              color: '#52c41a',
            },
          },
        ],
      };
      chart.setOption(option);

      const handleResize = () => {
        chart.resize();
      };
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
        chart.dispose();
      };
    }
  }, []);

  useEffect(() => {
    if (pieChartRef.current && topics.length > 0) {
      const tabCount: Record<string, number> = {};
      topics.forEach((topic) => {
        tabCount[topic.tab] = (tabCount[topic.tab] || 0) + 1;
      });

      const tabLabels: Record<string, string> = {
        good: '精华',
        share: '分享',
        ask: '问答',
        job: '招聘',
        dev: '开发',
      };

      const pieChart = echarts.init(pieChartRef.current);
      const pieOption = {
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)',
        },
        legend: {
          orient: 'vertical',
          right: '5%',
          top: 'center',
        },
        series: [
          {
            name: '话题分类',
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['40%', '50%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 4,
              borderColor: '#fff',
              borderWidth: 2,
            },
            label: {
              show: false,
              position: 'center',
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 16,
                fontWeight: 'bold',
              },
            },
            labelLine: {
              show: false,
            },
            data: Object.entries(tabCount).map(([tab, count]) => ({
              name: tabLabels[tab] || tab,
              value: count,
              itemStyle: {
                color: tab === 'good' ? '#f5222d' :
                       tab === 'share' ? '#52c41a' :
                       tab === 'ask' ? '#1890ff' :
                       tab === 'job' ? '#fa8c16' : '#722ed1',
              },
            })),
          },
        ],
      };
      pieChart.setOption(pieOption);

      const handleResize = () => {
        pieChart.resize();
      };
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
        pieChart.dispose();
      };
    }
  }, [topics]);

  return (
      <div>
          <h2 className="h2Tile">仪表盘</h2>
          <Row gutter={16} style={{ marginBottom: 24 }}>
              <Col span={6}>
                  <Card>
                      <Statistic
                          title="用户总数"
                          value={8848}
                          prefix={<UserOutlined />}
                          suffix="人"
                          valueStyle={{ color: '#1890ff' }}
                      />
                  </Card>
              </Col>
              <Col span={6}>
                  <Card>
                      <Statistic
                          title="订单总数"
                          value={12345}
                          prefix={<ShoppingCartOutlined />}
                          suffix="单"
                          valueStyle={{ color: '#52c41a' }}
                      />
                  </Card>
              </Col>
              <Col span={6}>
                  <Card>
                      <Statistic
                          title="话题总数"
                          value={topicCount}
                          prefix={<MessageOutlined />}
                          suffix="条"
                          valueStyle={{ color: '#faad14' }}
                      />
                  </Card>
              </Col>
              <Col span={6}>
                  <Card>
                      <Statistic
                          title="增长率"
                          value={12.5}
                          prefix={<ArrowUpOutlined />}
                          suffix="%"
                          valueStyle={{ color: '#52c41a' }}
                      />
                  </Card>
              </Col>
          </Row>
          <Row gutter={16}>
              <Col span={16}>
                  <Card title="数据统计" style={{ height: 400 }}>
                      <div ref={chartRef} style={{ width: '100%', height: '320px' }} />
                  </Card>
              </Col>
              <Col span={8}>
                  <Card title="话题分类" style={{ height: 400 }}>
                      <div ref={pieChartRef} style={{ width: '100%', height: '320px' }} />
                  </Card>
              </Col>
          </Row>
      </div>
  );
}
