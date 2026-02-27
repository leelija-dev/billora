import React from 'react'
import { FiDollarSign, FiShoppingBag, FiPackage, FiUsers, FiTrendingUp, FiTrendingDown } from 'react-icons/fi'

const StatsCards = ({ stats }) => {
  const cards = [
    {
      title: 'Total Revenue',
      value: `$${stats.revenue?.toLocaleString() || 0}`,
      icon: FiDollarSign,
      change: stats.revenueChange || 12.5,
      color: 'bg-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-600 dark:text-green-400',
    },
    {
      title: 'Total Orders',
      value: stats.orders?.toLocaleString() || 0,
      icon: FiShoppingBag,
      change: stats.ordersChange || 8.2,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      title: 'Products',
      value: stats.products?.toLocaleString() || 0,
      icon: FiPackage,
      change: stats.productsChange || -3.1,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      textColor: 'text-purple-600 dark:text-purple-400',
    },
    {
      title: 'Customers',
      value: stats.customers?.toLocaleString() || 0,
      icon: FiUsers,
      change: stats.customersChange || 15.3,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      textColor: 'text-orange-600 dark:text-orange-400',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon
        const isPositive = card.change >= 0
        
        return (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                  {card.value}
                </p>
                <div className="flex items-center mt-2">
                  <div className={`
                    flex items-center text-xs font-medium
                    ${isPositive ? 'text-green-600' : 'text-red-600'}
                  `}>
                    {isPositive ? (
                      <FiTrendingUp className="w-3 h-3 mr-1" />
                    ) : (
                      <FiTrendingDown className="w-3 h-3 mr-1" />
                    )}
                    {Math.abs(card.change)}%
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                    vs last month
                  </span>
                </div>
              </div>
              <div className={`p-3 rounded-full ${card.bgColor}`}>
                <Icon className={`w-6 h-6 ${card.textColor}`} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default StatsCards