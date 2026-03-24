import React, { useState, useEffect } from 'react'
import { productsAPI, brandsAPI, categoriesAPI, unitsAPI, apiClient } from '../../services'
import { useAuthStore } from '../../store/authStore'
import QuickLogin from './QuickLogin'

const APITest = () => {
  const [results, setResults] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { user, tokens, isAuthenticated } = useAuthStore()

  const testAPI = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const testResults = {}
      
      // Test products API
      try {
        const productsResponse = await productsAPI.getAll()
        testResults.products = {
          success: true,
          count: productsResponse.data?.length || 0,
          data: productsResponse.data
        }
      } catch (err) {
        testResults.products = {
          success: false,
          error: err.message,
          status: err.response?.status,
          statusText: err.response?.statusText
        }
      }

      // Test brands API
      try {
        const brandsResponse = await brandsAPI.getAll()
        testResults.brands = {
          success: true,
          count: brandsResponse.data?.length || 0,
          data: brandsResponse.data
        }
      } catch (err) {
        testResults.brands = {
          success: false,
          error: err.message,
          status: err.response?.status,
          statusText: err.response?.statusText
        }
      }

      // Test categories API
      try {
        const categoriesResponse = await categoriesAPI.getAll()
        testResults.categories = {
          success: true,
          count: categoriesResponse.data?.length || 0,
          data: categoriesResponse.data
        }
      } catch (err) {
        testResults.categories = {
          success: false,
          error: err.message,
          status: err.response?.status,
          statusText: err.response?.statusText
        }
      }

      // Test units API
      try {
        const unitsResponse = await unitsAPI.getAll()
        testResults.units = {
          success: true,
          count: unitsResponse.data?.length || 0,
          data: unitsResponse.data
        }
      } catch (err) {
        testResults.units = {
          success: false,
          error: err.message,
          status: err.response?.status,
          statusText: err.response?.statusText
        }
      }

      setResults(testResults)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const testAuthHeaders = async () => {
    try {
      // Test a protected endpoint to see if token is working
      const response = await apiClient.get('/products')
      console.log('🔐 Auth headers test successful:', response.status)
      alert('✅ Auth headers are working! Token is being sent correctly.')
    } catch (error) {
      console.error('❌ Auth headers test failed:', error)
      alert(`❌ Auth headers failed: ${error.response?.status} - ${error.response?.statusText}`)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">API Test Dashboard</h2>
      
      <div className="mb-6 p-4 bg-gray-100 rounded-lg">
        <p><strong>Environment Variables:</strong></p>
        <p>VITE_API_BASE_URL: {import.meta.env.VITE_API_BASE_URL}</p>
        <p>VITE_DATA_SOURCE: {import.meta.env.VITE_DATA_SOURCE}</p>
      </div>

      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p><strong>Authentication Status:</strong></p>
        <p>Authenticated: {isAuthenticated ? '✅ Yes' : '❌ No'}</p>
        <p>User ID: {user?.id || 'Not logged in'}</p>
        <p>User Name: {user?.name || 'N/A'}</p>
        <p>Has Access Token: {tokens?.access ? '✅ Yes' : '❌ No'}</p>
        <p>Token Preview: {tokens?.access ? `${tokens.access.substring(0, 30)}...` : 'None'}</p>
        <button
          onClick={testAuthHeaders}
          className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
        >
          Test Auth Headers
        </button>
      </div>

      <button
        onClick={testAPI}
        disabled={loading}
        className="mb-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Test APIs'}
      </button>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="space-y-4">
        {Object.entries(results).map(([apiName, result]) => (
          <div key={apiName} className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">{apiName.toUpperCase()} API</h3>
            {result.success ? (
              <div>
                <span className="text-green-600">✓ Success</span>
                <p>Count: {result.count}</p>
                <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </div>
            ) : (
              <div>
                <span className="text-red-600">✗ Failed</span>
                <p>Error: {result.error}</p>
                {result.status && <p>Status: {result.status} {result.statusText}</p>}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <QuickLogin />
    </div>
  )
}

export default APITest
