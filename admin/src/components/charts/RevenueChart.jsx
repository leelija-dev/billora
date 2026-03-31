import React from 'react'
import ReactApexChart from 'react-apexcharts'

const RevenueChart = ({ data, height = 320 }) => {
  const chartOptions = {
    chart: {
      type: 'area',
      height: height,
      zoom: {
        enabled: false
      },
      toolbar: {
        show: false
      },
      background: 'transparent',
      dropShadow: {
        enabled: true,
        top: 0,
        left: 0,
        blur: 15,
        opacity: 0.08,
        color: '#3b82f6'
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 4,
      lineCap: 'round',
      shadow: {
        enabled: true,
        color: '#3b82f6',
        offsetX: 0,
        offsetY: 10,
        blur: 10,
        opacity: 0.2
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.8,
        opacityTo: 0.05,
        stops: [0, 90, 100],
        colorStops: [
          {
            offset: 0,
            color: '#3b82f6',
            opacity: 0.8
          },
          {
            offset: 50,
            color: '#60a5fa',
            opacity: 0.4
          },
          {
            offset: 100,
            color: '#93c5fd',
            opacity: 0.05
          }
        ]
      }
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
        top: 0,
        right: 0,
        bottom: 0,
        left: 10
      }
    },
    xaxis: {
      categories: Array.isArray(data) ? data.map(item => item.date) : [],
      labels: {
        style: {
          colors: '#64748b',
          fontSize: '13px',
          fontWeight: '500',
          fontFamily: 'Inter, system-ui, sans-serif'
        },
        offsetY: 0
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      },
      crosshairs: {
        show: false
      }
    },
    yaxis: {
      labels: {
        formatter: function (value) {
          return '$' + (value / 1000).toFixed(1) + 'k'
        },
        style: {
          colors: '#64748b',
          fontSize: '13px',
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
        top: 0,
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
      x: {
        formatter: function (value) {
          return value
        }
      },
      y: {
        formatter: function (value) {
          return '$' + value.toLocaleString()
        }
      },
      marker: {
        show: true,
        fillColors: ['#3b82f6']
      },
      shared: true,
      intersect: false,
      followCursor: true
    },
    colors: ['#3b82f6'],
    markers: {
      size: 0,
      colors: ['#3b82f6'],
      strokeColors: ['#fff'],
      strokeWidth: 3,
      strokeOpacity: 1,
      fillOpacity: 1,
      discrete: [],
      shape: 'circle',
      radius: 4,
      hover: {
        size: 8,
        sizeOffset: 3,
        strokeWidth: 3,
        strokeColors: ['#fff'],
        fillColors: ['#3b82f6']
      }
    },
    annotations: {
      yaxis: [
        {
          y: 0,
          borderColor: '#e2e8f0',
          borderWidth: 2,
          strokeDashArray: 5,
          opacity: 0.5
        }
      ]
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
      speed: 1000,
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
    data: Array.isArray(data) ? data.map(item => item.revenue) : []
  }]

  return (
    <div className="h-80">
      <ReactApexChart 
        options={chartOptions} 
        series={chartSeries} 
        type="area" 
        height={height}
      />
    </div>
  )
}

export default RevenueChart
