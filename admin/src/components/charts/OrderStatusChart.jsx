import React from 'react'
import ReactApexChart from 'react-apexcharts'

const OrderStatusChart = ({ data, height = 320 }) => {
  const COLORS = {
    completed: '#10b981',
    pending: '#f59e0b', 
    processing: '#3b82f6',
    cancelled: '#ef4444'
  }

  // Transform API data to chart format
  const chartData = Object.entries(data || {}).map(([status, count]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: count,
    color: COLORS[status] || '#6b7280'
  })).filter(item => item.value > 0)

  const chartOptions = {
    chart: {
      type: 'donut',
      height: height,
      toolbar: {
        show: false
      },
      background: 'transparent',
      dropShadow: {
        enabled: true,
        top: 0,
        left: 0,
        blur: 10,
        opacity: 0.1,
        color: '#000'
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function (val, opts) {
        return opts.w.config.series[opts.seriesIndex]
      },
      style: {
        fontSize: '14px',
        fontWeight: '700',
        colors: ['#fff'],
        textShadow: '0px 2px 4px rgba(0,0,0,0.3)'
      },
      dropShadow: {
        enabled: true,
        top: 2,
        left: 2,
        blur: 4,
        opacity: 0.2,
        color: '#000'
      }
    },
    stroke: {
      show: true,
      width: 3,
      colors: ['#fff'],
      lineCap: 'round'
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'diagonal',
        shadeIntensity: 0.8,
        gradientToColors: undefined,
        inverseColors: false,
        opacityFrom: 0.9,
        opacityTo: 0.7,
        stops: [0, 100]
      }
    },
    labels: chartData.map(item => item.name),
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
      offsetY: 10,
      labels: {
        colors: '#64748b',
        useSeriesColors: false,
        fontSize: '13px',
        fontWeight: '500',
        fontFamily: 'Inter, system-ui, sans-serif'
      },
      markers: {
        width: 14,
        height: 14,
        strokeWidth: 0,
        strokeColor: '#fff',
        fillColors: chartData.map(item => item.color),
        radius: 7,
        customHTML: undefined,
        onClick: undefined,
        offsetX: 0,
        offsetY: 0
      },
      itemMargin: {
        horizontal: 15,
        vertical: 5
      }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom',
          offsetY: 0,
          fontSize: '11px'
        }
      }
    }],
    colors: chartData.map(item => item.color),
    tooltip: {
      theme: 'dark',
      style: {
        fontSize: '12px',
        fontFamily: 'Inter, system-ui, sans-serif'
      },
      y: {
        formatter: function (value) {
          return value + ' orders'
        }
      },
      marker: {
        show: true,
        fillColors: chartData.map(item => item.color)
      }
    },
    plotOptions: {
      pie: {
        startAngle: -90,
        endAngle: 270,
        donut: {
          size: '70%',
          background: 'transparent',
          labels: {
            show: true,
            total: {
              show: true,
              showAlways: true,
              label: 'Total Orders',
              fontSize: '18px',
              fontWeight: '600',
              color: '#374151',
              fontFamily: 'Inter, system-ui, sans-serif',
              offsetY: -10
            },
            value: {
              show: true,
              fontSize: '32px',
              fontWeight: '800',
              color: '#3b82f6',
              fontFamily: 'Inter, system-ui, sans-serif',
              offsetY: 10,
              formatter: function (val) {
                return val
              }
            }
          }
        },
        expandOnClick: true,
        offsetX: 0,
        offsetY: 0,
        customScale: 1,
        dataLabels: {
          offset: 0,
          minAngleToShowLabel: 10
        }
      }
    },
    states: {
      hover: {
        filter: {
          type: 'brighten',
          value: 0.1
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
      speed: 800,
      animateGradually: {
        enabled: true,
        delay: 150
      },
      dynamicAnimation: {
        enabled: true,
        speed: 350
      }
    }
  }

  const chartSeries = chartData.map(item => item.value)

  if (chartData.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-gray-500 dark:text-gray-400">No order data available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-80">
      <ReactApexChart 
        options={chartOptions} 
        series={chartSeries} 
        type="donut" 
        height={height}
      />
    </div>
  )
}

export default OrderStatusChart
