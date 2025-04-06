import React, { Component } from 'react';
import { 
  FiTrendingUp, 
  FiShoppingCart, 
  FiDollarSign, 
  FiPercent,
  FiStar,
  FiClock,
  FiCheckCircle,
  FiTruck,
  FiRefreshCw,
  FiMoreVertical
} from 'react-icons/fi';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

// Modern color palette
const colors = {
  primary: '#6366F1',
  secondary: '#8B5CF6',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  dark: '#1F2937',
  light: '#F3F4F6'
};

// Mock sales data
const salesData = {
  summary: {
    totalSales: 125430,
    totalOrders: 342,
    conversionRate: 3.2,
    avgOrderValue: 367,
  },
  trends: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    revenue: [12500, 19000, 22000, 18000, 25000, 21000, 28000],
    orders: [45, 60, 75, 55, 80, 70, 95],
  },
  topProducts: [
    { id: 1, name: 'Premium Laptop', price: 1299, sales: 42, revenue: 54558, trend: 'up' },
    { id: 2, name: 'Wireless Headphones', price: 199, sales: 87, revenue: 17313, trend: 'up' },
    { id: 3, name: 'Smart Watch', price: 249, sales: 53, revenue: 13197, trend: 'down' },
    { id: 4, name: 'Bluetooth Speaker', price: 129, sales: 64, revenue: 8256, trend: 'up' },
    { id: 5, name: 'External SSD', price: 149, sales: 38, revenue: 5662, trend: 'down' },
  ],
  recentOrders: [
    { id: 1001, customer: 'John Smith', date: '2023-07-15', amount: 367, status: 'completed' },
    { id: 1002, customer: 'Sarah Johnson', date: '2023-07-14', amount: 249, status: 'completed' },
    { id: 1003, customer: 'Michael Brown', date: '2023-07-14', amount: 1299, status: 'processing' },
    { id: 1004, customer: 'Emily Davis', date: '2023-07-13', amount: 199, status: 'completed' },
    { id: 1005, customer: 'Robert Wilson', date: '2023-07-12', amount: 567, status: 'shipped' },
  ]
};

class SalesDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      loading: true,
      timeRange: 'monthly',
      activeTab: 'overview'
    };
  }

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.timeRange !== this.state.timeRange) {
      this.loadData();
    }
  }

  loadData = () => {
    this.setState({ loading: true });
    
    // Simulate API call with timeout
    setTimeout(() => {
      this.setState({
        data: salesData,
        loading: false
      });
    }, 800);
  }

  handleTimeRangeChange = (range) => {
    this.setState({ timeRange: range });
  }

  handleTabChange = (tab) => {
    this.setState({ activeTab: tab });
  }

  renderStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <FiCheckCircle className="mr-1" /> Completed
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <FiRefreshCw className="mr-1" /> Processing
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <FiTruck className="mr-1" /> Shipped
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  }

  renderTrendIndicator = (trend) => {
    return trend === 'up' ? (
      <span className="inline-flex items-center text-green-600">
        <FiTrendingUp className="mr-1" /> Up
      </span>
    ) : (
      <span className="inline-flex items-center text-red-600">
        <FiTrendingUp className="mr-1 transform rotate-180" /> Down
      </span>
    );
  }

  render() {
    const { data, loading, timeRange, activeTab } = this.state;

    if (loading || !data) {
      return (
        <div className="flex justify-center items-center h-screen bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      );
    }

    // Chart data configuration
    const revenueChartData = {
      labels: data.trends.labels,
      datasets: [
        {
          label: 'Revenue',
          data: data.trends.revenue,
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          borderColor: colors.primary,
          borderWidth: 2,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: colors.primary,
          pointBorderColor: '#fff',
          pointHoverRadius: 5,
          pointHoverBorderWidth: 2,
        }
      ]
    };

    const ordersChartData = {
      labels: data.trends.labels,
      datasets: [
        {
          label: 'Orders',
          data: data.trends.orders,
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          borderColor: colors.success,
          borderWidth: 2,
          tension: 0.4,
          pointBackgroundColor: colors.success,
          pointBorderColor: '#fff',
          pointHoverRadius: 5,
          pointHoverBorderWidth: 2,
        }
      ]
    };

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            usePointStyle: true,
            padding: 20,
            font: {
              family: 'Inter, sans-serif'
            }
          },
        },
        tooltip: {
          backgroundColor: colors.dark,
          titleFont: {
            family: 'Inter, sans-serif',
            size: 14
          },
          bodyFont: {
            family: 'Inter, sans-serif',
            size: 12
          },
          padding: 12,
          usePointStyle: true,
          cornerRadius: 8
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            drawBorder: false,
            color: 'rgba(0, 0, 0, 0.05)'
          },
          ticks: {
            font: {
              family: 'Inter, sans-serif'
            }
          }
        },
        x: {
          grid: {
            display: false,
          },
          ticks: {
            font: {
              family: 'Inter, sans-serif'
            }
          }
        },
      },
    };

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Sales Dashboard</h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <select 
                  value={timeRange}
                  onChange={(e) => this.handleTimeRangeChange(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <FiMoreVertical className="text-gray-500" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => this.handleTabChange('overview')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'overview' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Overview
              </button>
              <button
                onClick={() => this.handleTabChange('products')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'products' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Products
              </button>
              <button
                onClick={() => this.handleTabChange('customers')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'customers' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Customers
              </button>
              <button
                onClick={() => this.handleTabChange('reports')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'reports' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Reports
              </button>
            </nav>
          </div>

          {/* Summary Cards */}
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Total Sales */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                    <FiDollarSign className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Sales</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">${data.summary.totalSales.toLocaleString()}</div>
                      <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                        <FiTrendingUp className="self-center flex-shrink-0 h-4 w-4 text-green-500" />
                        <span className="sr-only">Increased by</span>
                        12.5%
                      </div>
                    </dd>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Orders */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                    <FiShoppingCart className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{data.summary.totalOrders}</div>
                      <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                        <FiTrendingUp className="self-center flex-shrink-0 h-4 w-4 text-green-500" />
                        <span className="sr-only">Increased by</span>
                        8.3%
                      </div>
                    </dd>
                  </div>
                </div>
              </div>
            </div>

            {/* Conversion Rate */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                    <FiPercent className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dt className="text-sm font-medium text-gray-500 truncate">Conversion Rate</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{data.summary.conversionRate}%</div>
                      <div className="ml-2 flex items-baseline text-sm font-semibold text-red-600">
                        <FiTrendingUp className="self-center flex-shrink-0 h-4 w-4 text-red-500 transform rotate-180" />
                        <span className="sr-only">Decreased by</span>
                        1.2%
                      </div>
                    </dd>
                  </div>
                </div>
              </div>
            </div>

            {/* Avg. Order Value */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                    <FiStar className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dt className="text-sm font-medium text-gray-500 truncate">Avg. Order Value</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">${data.summary.avgOrderValue}</div>
                      <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                        <FiTrendingUp className="self-center flex-shrink-0 h-4 w-4 text-green-500" />
                        <span className="sr-only">Increased by</span>
                        5.7%
                      </div>
                    </dd>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Revenue Trend</h2>
                <div className="h-80">
                  <Line data={revenueChartData} options={chartOptions} />
                </div>
              </div>
            </div>

            {/* Orders Chart */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Orders Trend</h2>
                <div className="h-80">
                  <Bar data={ordersChartData} options={chartOptions} />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Top Products */}
            <div className="lg:col-span-2 bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium text-gray-900">Top Selling Products</h2>
                  <button className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                    View all
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trend</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {data.topProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">${product.price}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{product.sales}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">${product.revenue.toLocaleString()}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm">
                              {this.renderTrendIndicator(product.trend)}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium text-gray-900">Recent Orders</h2>
                  <button className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                    View all
                  </button>
                </div>
                <div className="space-y-4">
                  {data.recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:shadow-sm transition-shadow">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">#{order.id}</p>
                          <p className="text-sm text-gray-500">{order.customer}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">${order.amount}</p>
                          <div className="flex items-center justify-end mt-1">
                            <FiClock className="text-gray-400 mr-1" size={14} />
                            <span className="text-xs text-gray-500">{order.date}</span>
                          </div>
                        </div>
                        <div>
                          {this.renderStatusBadge(order.status)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default SalesDashboard;