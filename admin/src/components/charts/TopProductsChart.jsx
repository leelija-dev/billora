import React from 'react'
import ReactApexChart from 'react-apexcharts'

const TopProductsChart = ({ data, height = 320 }) => {
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

  const chartOptions = {
    chart: {
      type: 'bar',
      height: height,
      toolbar: {
        show: false
      },
      background: 'transparent',
      dropShadow: {
        enabled: true,
        top: 0,
        left: 0,
        blur: 12,
        opacity: 0.08,
        color: '#000'
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 12,
        borderRadiusApplication: 'end',
        horizontal: false,
        columnWidth: '55%',
        distributed: true,
        dataLabels: {
          position: 'top',
          maxItems: 100,
          hideOverflowingLabels: true,
          orientation: 'horizontal',
          style: {
            fontSize: '11px',
            fontWeight: '600',
            colors: ['#64748b']
          }
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function (value) {
        if (value >= 100000) {
          return 'Rs ' + (value / 100000).toFixed(1) + 'L'
        } else if (value >= 1000) {
          return 'Rs ' + (value / 1000).toFixed(1) + 'k'
        } else {
          return 'Rs ' + value.toFixed(0)
        }
      },
      offsetY: -15,
      style: {
        fontSize: '11px',
        fontWeight: '600',
        colors: ['#64748b'],
        fontFamily: 'Inter, system-ui, sans-serif'
      },
      dropShadow: {
        enabled: false
      }
    },
    stroke: {
      show: true,
      width: 0,
      colors: ['transparent']
    },
    grid: {
      borderColor: '#e2e8f0',
      strokeDashArray: 5,
      xaxis: {
        lines: {
          show: false
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      },
      padding: {
        top: 20,
        right: 0,
        bottom: 0,
        left: 10
      }
    },
    xaxis: {
      categories: Array.isArray(data) ? data.map(item => {
        const maxLength = 15
        const name = item.name || ''
        return name.length > maxLength ? name.substring(0, maxLength) + '...' : name
      }) : [],
      labels: {
        style: {
          colors: '#64748b',
          fontSize: '12px',
          fontWeight: '500',
          fontFamily: 'Inter, system-ui, sans-serif'
        },
        offsetY: 5
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      labels: {
        formatter: function (value) {
          if (value >= 100000) {
            return 'Rs ' + (value / 100000).toFixed(1) + 'L'
          } else if (value >= 1000) {
            return 'Rs ' + (value / 1000).toFixed(1) + 'k'
          } else {
            return 'Rs ' + value.toFixed(0)
          }
        },
        style: {
          colors: '#64748b',
          fontSize: '12px',
          fontWeight: '500',
          fontFamily: 'Inter, system-ui, sans-serif'
        },
        offsetX: -5
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      },
      padding: {
        top: 20,
        right: 0,
        bottom: 0,
        left: 10
      }
    },
    tooltip: {
      theme: 'dark',
      style: {
        fontSize: '12px',
        fontFamily: 'Inter, system-ui, sans-serif'
      },
      y: {
        formatter: function (value) {
          return 'Rs ' + value.toLocaleString('en-IN')
        }
      },
      custom: function({ series, seriesIndex, dataPointIndex, w }) {
        const item = data[dataPointIndex]
        if (!item) return ''
        
        return `
          <div class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700">
            <p class="text-sm font-medium text-gray-900 dark:text-white mb-2">${item.name}</p>
            <div class="space-y-1">
              <p class="text-sm text-primary-600 dark:text-primary-400">Sales: ${parseFloat(item.sales || 0).toLocaleString('en-IN')}</p>
              <p class="text-sm text-green-600 dark:text-green-400">Revenue: Rs ${parseFloat(item.revenue || 0).toLocaleString('en-IN')}</p>
              ${item.trend ? `<p class="text-xs text-gray-500 dark:text-gray-400">Trend: ${item.trend}</p>` : ''}
            </div>
          </div>
        `
      },
      marker: {
        show: true,
        fillColors: COLORS
      },
      followCursor: true
    },
    colors: COLORS,
    legend: {
      show: false
    },
    states: {
      hover: {
        filter: {
          type: 'brighten',
          value: 0.15
        }
      },
      active: {
        filter: {
          type: 'none',
          value: 0
        }
      }
    },
    animation: {
      enabled: true,
      easing: 'easeinout',
      speed: 1200,
      animateGradually: {
        enabled: true,
        delay: 100
      },
      dynamicAnimation: {
        enabled: true,
        speed: 400
      }
    }
  }

  const chartSeries = [{
    name: 'Revenue',
    data: Array.isArray(data) ? data.map(item => parseFloat(item.revenue || 0)) : []
  }]

  if (!data || data.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <p className="text-gray-500 dark:text-gray-400">No product data available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-80">
      <ReactApexChart 
        options={chartOptions} 
        series={chartSeries} 
        type="bar" 
        height={height}
      />
    </div>
  )
}

export default TopProductsChart
