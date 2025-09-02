'use client'
import { useEffect, useState } from 'react'
import { useProducts } from '@/hooks/useProducts'
import { useProductCategories } from '@/hooks/useProductCategories'
import { FiShoppingBag, FiTag, FiTrendingUp, FiLoader, FiAlertCircle } from 'react-icons/fi'
import dynamic from 'next/dynamic'

// Dynamic imports for Chart.js components to prevent SSR issues
const Bar = dynamic(() => import('react-chartjs-2').then((mod) => mod.Bar), { ssr: false })
const Pie = dynamic(() => import('react-chartjs-2').then((mod) => mod.Pie), { ssr: false })
const Line = dynamic(() => import('react-chartjs-2').then((mod) => mod.Line), { ssr: false })

// Chart.js registration (you'll need to add this in a separate file or component)
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  PointElement
)

export default function DashboardPage() {
  const { data: productsData, isLoading: loadingProducts, error: productsError } = useProducts()
  const { data: categoriesData, isLoading: loadingCategories, error: categoriesError } = useProductCategories()

  const [dashboardStats, setDashboardStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalValue: 0,
    avgPrice: 0
  })

  const products = productsData?.data || []
  const categories = categoriesData?.data || []

  // Calculate dashboard statistics
  useEffect(() => {
    if (products.length > 0) {
      const totalValue = products.reduce((sum, product) => sum + (parseFloat(product.price) || 0), 0)
      const avgPrice = products.length > 0 ? totalValue / products.length : 0

      setDashboardStats({
        totalProducts: products.length,
        totalCategories: categories.length,
        totalValue,
        avgPrice
      })
    }
  }, [products, categories])

  // Prepare data for charts
  const prepareCategoryDistribution = () => {
    const categoryCount = {}
    const categoryNames = {}

    // Create category mapping
    categories.forEach(cat => {
      categoryNames[cat._id] = cat.name
      categoryCount[cat._id] = 0
    })

    // Count products per category
    products.forEach(product => {
      if (product.categories && Array.isArray(product.categories)) {
        product.categories.forEach(categoryId => {
          if (typeof categoryId === 'object' && categoryId._id) {
            categoryCount[categoryId._id] = (categoryCount[categoryId._id] || 0) + 1
            categoryNames[categoryId._id] = categoryId.name
          } else if (typeof categoryId === 'string') {
            categoryCount[categoryId] = (categoryCount[categoryId] || 0) + 1
          }
        })
      }
    })

    const labels = Object.keys(categoryCount).map(id => categoryNames[id] || 'Unknown')
    const data = Object.values(categoryCount)

    return { labels, data }
  }

  const preparePriceDistribution = () => {
    const priceRanges = {
      '0-100': 0,
      '101-500': 0,
      '501-1000': 0,
      '1001-5000': 0,
      '5000+': 0
    }

    products.forEach(product => {
      const price = parseFloat(product.price) || 0
      if (price <= 100) priceRanges['0-100']++
      else if (price <= 500) priceRanges['101-500']++
      else if (price <= 1000) priceRanges['501-1000']++
      else if (price <= 5000) priceRanges['1001-5000']++
      else priceRanges['5000+']++
    })

    return {
      labels: Object.keys(priceRanges),
      data: Object.values(priceRanges)
    }
  }

  // Chart configurations
  const categoryDistribution = prepareCategoryDistribution()
  const priceDistribution = preparePriceDistribution()

  const barChartData = {
    labels: ['Products', 'Categories'],
    datasets: [{
      label: 'Count',
      data: [dashboardStats.totalProducts, dashboardStats.totalCategories],
      backgroundColor: ['#ef4444', '#3b82f6'],
      borderColor: ['#dc2626', '#2563eb'],
      borderWidth: 1
    }]
  }

  const pieChartData = {
    labels: categoryDistribution.labels,
    datasets: [{
      label: 'Products by Category',
      data: categoryDistribution.data,
      backgroundColor: [
        '#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6',
        '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1'
      ],
      borderWidth: 2,
      borderColor: '#ffffff'
    }]
  }

  const lineChartData = {
    labels: priceDistribution.labels,
    datasets: [{
      label: 'Product Count by Price Range',
      data: priceDistribution.data,
      borderColor: '#ef4444',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      tension: 0.4,
      pointBackgroundColor: '#ef4444',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
      pointRadius: 6
    }]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#f3f4f6'
        }
      },
      x: {
        grid: {
          color: '#f3f4f6'
        }
      }
    }
  }

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true
        }
      }
    }
  }

  if (loadingProducts || loadingCategories) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <FiLoader className="animate-spin h-8 w-8 text-red-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  if (productsError || categoriesError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <FiAlertCircle className="w-8 h-8 text-red-600 mx-auto mb-4" />
        <p className="text-red-600">Error loading dashboard data</p>
        <p className="text-sm text-gray-600 mt-2">
          {productsError?.message || categoriesError?.message}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Overview of your inventory and analytics
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <FiShoppingBag className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalProducts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FiTag className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalCategories}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <FiTrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{dashboardStats.totalValue.toLocaleString('en-IN')}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FiTrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Price</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{Math.round(dashboardStats.avgPrice).toLocaleString('en-IN')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inventory Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Inventory Overview</h2>
          <div className="h-64">
            <Bar data={barChartData} options={chartOptions} />
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Products by Category</h2>
          <div className="h-64">
            {categoryDistribution.labels.length > 0 ? (
              <Pie data={pieChartData} options={pieOptions} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No category data available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Most Expensive Product</p>
            <p className="text-lg font-bold text-gray-900">
              ₹{Math.max(...products.map(p => parseFloat(p.price) || 0)).toLocaleString('en-IN')}
            </p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Cheapest Product</p>
            <p className="text-lg font-bold text-gray-900">
              ₹{Math.min(...products.map(p => parseFloat(p.price) || 0)).toLocaleString('en-IN')}
            </p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Products per Category</p>
            <p className="text-lg font-bold text-gray-900">
              {categories.length > 0 ? Math.round(products.length / categories.length) : 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
