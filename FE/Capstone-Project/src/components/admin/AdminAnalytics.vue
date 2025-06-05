<template>
  <div class="p-6">
    <!-- Thống kê tổng quan -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <!-- Tổng số hồ sơ -->
      <div class="bg-white rounded-lg shadow-md p-6 flex items-center">
        <div class="rounded-full bg-blue-100 p-3 mr-4">
          <i class="fas fa-file-alt text-blue-400 text-xl"></i>
        </div>
        <div>
          <p class="text-gray-500 text-sm">Tổng số hồ sơ</p>
          <p class="text-2xl font-bold">{{ profileStats.total || 0 }}</p>
        </div>
      </div>

      <!-- Hồ sơ đang hoạt động -->
      <div class="bg-white rounded-lg shadow-md p-6 flex items-center">
        <div class="rounded-full bg-green-100 p-3 mr-4">
          <i class="fas fa-check-circle text-green-600 text-xl"></i>
        </div>
        <div>
          <p class="text-gray-500 text-sm">Hồ sơ đang hoạt động</p>
          <p class="text-2xl font-bold">{{ profileStats.by_status?.active || 0 }}</p>
        </div>
      </div>

      <!-- Hồ sơ đã tìm thấy -->
      <div class="bg-white rounded-lg shadow-md p-6 flex items-center">
        <div class="rounded-full bg-purple-100 p-3 mr-4">
          <i class="fas fa-search text-purple-600 text-xl"></i>
        </div>
        <div>
          <p class="text-gray-500 text-sm">Hồ sơ đã tìm thấy</p>
          <p class="text-2xl font-bold">{{ profileStats.by_status?.found || 0 }}</p>
        </div>
      </div>

      <!-- Hồ sơ đã đóng -->
      <div class="bg-white rounded-lg shadow-md p-6 flex items-center">
        <div class="rounded-full bg-yellow-100 p-3 mr-4">
          <i class="fas fa-lock text-yellow-600 text-xl"></i>
        </div>
        <div>
          <p class="text-gray-500 text-sm">Hồ sơ đã đóng</p>
          <p class="text-2xl font-bold">{{ profileStats.by_status?.closed || 0 }}</p>
        </div>
      </div>
    </div>

    <!-- Thêm thống kê tổng quan cho báo cáo -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <!-- Tổng số báo cáo -->
      <div class="bg-white rounded-lg shadow-md p-6 flex items-center">
        <div class="rounded-full bg-indigo-100 p-3 mr-4">
          <i class="fas fa-file-alt text-indigo-600 text-xl"></i>
        </div>
        <div>
          <p class="text-gray-500 text-sm">Tổng số báo cáo</p>
          <p class="text-2xl font-bold">{{ reportStats.total || 0 }}</p>
        </div>
      </div>

      <!-- Báo cáo đang hoạt động -->
      <div class="bg-white rounded-lg shadow-md p-6 flex items-center">
        <div class="rounded-full bg-green-100 p-3 mr-4">
          <i class="fas fa-check-circle text-green-600 text-xl"></i>
        </div>
        <div>
          <p class="text-gray-500 text-sm">Báo cáo đang hoạt động</p>
          <p class="text-2xl font-bold">{{ reportStats.by_status?.active || 0 }}</p>
        </div>
      </div>

      <!-- Báo cáo đã tìm thấy -->
      <div class="bg-white rounded-lg shadow-md p-6 flex items-center">
        <div class="rounded-full bg-purple-100 p-3 mr-4">
          <i class="fas fa-search text-purple-600 text-xl"></i>
        </div>
        <div>
          <p class="text-gray-500 text-sm">Báo cáo đã tìm thấy</p>
          <p class="text-2xl font-bold">{{ reportStats.by_status?.found || 0 }}</p>
        </div>
      </div>

      <!-- Báo cáo đã đóng -->
      <div class="bg-white rounded-lg shadow-md p-6 flex items-center">
        <div class="rounded-full bg-yellow-100 p-3 mr-4">
          <i class="fas fa-lock text-yellow-600 text-xl"></i>
        </div>
        <div>
          <p class="text-gray-500 text-sm">Báo cáo đã đóng</p>
          <p class="text-2xl font-bold">{{ reportStats.by_status?.closed || 0 }}</p>
        </div>
      </div>
    </div>

    <!-- Biểu đồ thống kê -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- Biểu đồ hồ sơ theo trạng thái -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold">Hồ sơ theo trạng thái</h2>
        </div>
        <div class="h-64">
          <canvas ref="profileChartRef"></canvas>
        </div>
      </div>

      <!-- Biểu đồ cặp ghép đôi theo trạng thái -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold">Cặp ghép đôi theo trạng thái</h2>
        </div>
        <div class="h-64">
          <canvas ref="matchChartRef"></canvas>
        </div>
      </div>
    </div>

    <!-- Thêm biểu đồ thống kê cho báo cáo -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- Biểu đồ báo cáo theo trạng thái -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold">Báo cáo theo trạng thái</h2>
        </div>
        <div class="h-64">
          <canvas ref="reportChartRef"></canvas>
        </div>
      </div>

      <!-- Biểu đồ cặp báo cáo ghép đôi theo trạng thái -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold">Cặp báo cáo ghép đôi theo trạng thái</h2>
        </div>
        <div class="h-64">
          <canvas ref="reportMatchChartRef"></canvas>
        </div>
      </div>
    </div>

    <!-- Bảng thống kê chi tiết -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Bảng thống kê hồ sơ -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-lg font-semibold mb-4">Chi tiết hồ sơ theo trạng thái</h2>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số lượng</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tỷ lệ</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(count, status) in profileStats.by_status" :key="status">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="h-3 w-3 rounded-full mr-2" :class="getStatusColor(status)"></div>
                    <div class="text-sm font-medium text-gray-900">{{ getStatusName(status) }}</div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ count }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ profileStats.total ? Math.round((count / profileStats.total) * 100) : 0 }}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Bảng thống kê cặp ghép đôi -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-lg font-semibold mb-4">Chi tiết cặp ghép đôi theo trạng thái</h2>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số lượng</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tỷ lệ</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(count, status) in matchStats.by_status" :key="status">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="h-3 w-3 rounded-full mr-2" :class="getMatchStatusColor(status)"></div>
                    <div class="text-sm font-medium text-gray-900">{{ getMatchStatusName(status) }}</div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ count }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ matchStats.total ? Math.round((count / matchStats.total) * 100) : 0 }}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Thêm bảng thống kê chi tiết cho báo cáo -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <!-- Bảng thống kê báo cáo -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-lg font-semibold mb-4">Chi tiết báo cáo theo trạng thái</h2>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số lượng</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tỷ lệ</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(count, status) in reportStats.by_status" :key="status">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="h-3 w-3 rounded-full mr-2" :class="getStatusColor(status)"></div>
                    <div class="text-sm font-medium text-gray-900">{{ getStatusName(status) }}</div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ count }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ reportStats.total ? Math.round((count / reportStats.total) * 100) : 0 }}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Bảng thống kê cặp báo cáo ghép đôi -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-lg font-semibold mb-4">Chi tiết cặp báo cáo ghép đôi theo trạng thái</h2>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số lượng</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tỷ lệ</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(count, status) in reportMatchStats.by_status" :key="status">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="h-3 w-3 rounded-full mr-2" :class="getMatchStatusColor(status)"></div>
                    <div class="text-sm font-medium text-gray-900">{{ getMatchStatusName(status) }}</div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ count }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ reportMatchStats.total ? Math.round((count / reportMatchStats.total) * 100) : 0 }}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import Chart from 'chart.js/auto'
import api from '@/services/api'
import { useStore } from 'vuex'

export default {
  name: 'AdminAnalytics',
  setup() {
    const store = useStore()
    const profileChartRef = ref(null)
    const matchChartRef = ref(null)
    const reportChartRef = ref(null)
    const reportMatchChartRef = ref(null)
    const profileStats = ref({ total: 0, by_status: {} })
    const matchStats = ref({ total: 0, by_status: {} })
    const reportStats = ref({ total: 0, by_status: {} })
    const reportMatchStats = ref({ total: 0, by_status: {} })
    let profileChart = null
    let matchChart = null
    let reportChart = null
    let reportMatchChart = null

    const fetchStatistics = async () => {
      try {
        // Fetch profile statistics
        const profileResponse = await api.get('/profiles/statistics/')
        profileStats.value = profileResponse.data.profiles
        matchStats.value = profileResponse.data.matches

        // Fetch report statistics
        const reportResponse = await store.dispatch('recentlyMissing/fetchStatistics')
        reportStats.value = reportResponse.reports
        reportMatchStats.value = reportResponse.matches

        renderCharts()
      } catch (error) {
        console.error('Error fetching statistics:', error)
      }
    }

    const renderCharts = () => {
      // Biểu đồ hồ sơ theo trạng thái
      const profileCtx = profileChartRef.value.getContext('2d')
      if (profileChart) profileChart.destroy()
      
      profileChart = new Chart(profileCtx, {
        type: 'doughnut',
        data: {
          labels: Object.keys(profileStats.value.by_status).map(status => getStatusName(status)),
          datasets: [{
            data: Object.values(profileStats.value.by_status),
            backgroundColor: [
              'rgba(54, 162, 235, 0.7)',
              'rgba(75, 192, 192, 0.7)',
              'rgba(255, 159, 64, 0.7)'
            ],
            borderColor: [
              'rgba(54, 162, 235, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      })

      // Biểu đồ cặp ghép đôi theo trạng thái
      const matchCtx = matchChartRef.value.getContext('2d')
      if (matchChart) matchChart.destroy()
      
      matchChart = new Chart(matchCtx, {
        type: 'doughnut',
        data: {
          labels: Object.keys(matchStats.value.by_status).map(status => getMatchStatusName(status)),
          datasets: [{
            data: Object.values(matchStats.value.by_status),
            backgroundColor: [
              'rgba(255, 206, 86, 0.7)',
              'rgba(75, 192, 192, 0.7)',
              'rgba(255, 99, 132, 0.7)'
            ],
            borderColor: [
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(255, 99, 132, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      })

      // Biểu đồ báo cáo theo trạng thái
      const reportCtx = reportChartRef.value.getContext('2d')
      if (reportChart) reportChart.destroy()
      
      reportChart = new Chart(reportCtx, {
        type: 'doughnut',
        data: {
          labels: Object.keys(reportStats.value.by_status).map(status => getStatusName(status)),
          datasets: [{
            data: Object.values(reportStats.value.by_status),
            backgroundColor: [
              'rgba(54, 162, 235, 0.7)',
              'rgba(75, 192, 192, 0.7)',
              'rgba(255, 159, 64, 0.7)'
            ],
            borderColor: [
              'rgba(54, 162, 235, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      })

      // Biểu đồ cặp báo cáo ghép đôi theo trạng thái
      const reportMatchCtx = reportMatchChartRef.value.getContext('2d')
      if (reportMatchChart) reportMatchChart.destroy()
      
      reportMatchChart = new Chart(reportMatchCtx, {
        type: 'doughnut',
        data: {
          labels: Object.keys(reportMatchStats.value.by_status).map(status => getMatchStatusName(status)),
          datasets: [{
            data: Object.values(reportMatchStats.value.by_status),
            backgroundColor: [
              'rgba(255, 206, 86, 0.7)',
              'rgba(75, 192, 192, 0.7)',
              'rgba(255, 99, 132, 0.7)'
            ],
            borderColor: [
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(255, 99, 132, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      })
    }

    const getStatusName = (status) => {
      const statusMap = {
        'active': 'Đang hoạt động',
        'found': 'Đã tìm thấy',
        'closed': 'Đã đóng'
      }
      return statusMap[status] || status
    }

    const getMatchStatusName = (status) => {
      const statusMap = {
        'pending': 'Đang chờ',
        'accepted': 'Đã chấp nhận',
        'rejected': 'Đã từ chối'
      }
      return statusMap[status] || status
    }

    const getStatusColor = (status) => {
      const colorMap = {
        'active': 'bg-blue-500',
        'found': 'bg-green-500',
        'closed': 'bg-yellow-500'
      }
      return colorMap[status] || 'bg-gray-500'
    }

    const getMatchStatusColor = (status) => {
      const colorMap = {
        'pending': 'bg-yellow-500',
        'accepted': 'bg-green-500',
        'rejected': 'bg-red-500'
      }
      return colorMap[status] || 'bg-gray-500'
    }

    onMounted(() => {
      fetchStatistics()
    })

    return {
      profileChartRef,
      matchChartRef,
      reportChartRef,
      reportMatchChartRef,
      profileStats,
      matchStats,
      reportStats,
      reportMatchStats,
      getStatusName,
      getMatchStatusName,
      getStatusColor,
      getMatchStatusColor
    }
  }
}
</script>