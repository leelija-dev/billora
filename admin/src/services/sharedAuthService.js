// Shared Authentication Service for SSO between Next.js and React Admin
class SharedAuthService {
  constructor() {
    this.API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
    this.CHECK_AUTH_INTERVAL = 5 * 60 * 1000; // 5 minutes
    this.authCheckTimer = null;
  }

  // Get authentication cookies
  getAuthCookies() {
    const cookies = {};
    document.cookie.split(';').forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      if (name.startsWith('client_')) {
        cookies[name] = value;
      }
    });
    return cookies;
  }

  // Check if user is authenticated
  async checkAuthStatus() {
    try {
      const response = await fetch(`${this.API_BASE_URL}/auth/session/check`, {
        method: 'GET',
        credentials: 'include', // Important for cross-domain cookies
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        return {
          isAuthenticated: true,
          user: data.data || data.user,
          token: data.token
        };
      }
    } catch (error) {
      console.log('Auth check failed:', error);
    }

    return {
      isAuthenticated: false,
      user: null,
      token: null
    };
  }

  // Login with credentials
  async login(credentials) {
    try {
      const response = await fetch(`${this.API_BASE_URL}/users/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();
      
      if (data.status || data.success) {
        return {
          success: true,
          user: data.user,
          token: data.token
        };
      } else {
        return {
          success: false,
          message: data.message || 'Login failed'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Network error'
      };
    }
  }

  // Logout from all applications
  async logout() {
    try {
      await fetch(`${this.API_BASE_URL}/users/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });
    } catch (error) {
      console.log('Logout error:', error);
    }
  }

  // Start periodic auth checking
  startAuthStatusCheck(callback) {
    // Check immediately
    this.checkAuthStatus().then(callback);
    
    // Set up periodic checking
    this.authCheckTimer = setInterval(() => {
      this.checkAuthStatus().then(callback);
    }, this.CHECK_AUTH_INTERVAL);
  }

  // Stop periodic auth checking
  stopAuthStatusCheck() {
    if (this.authCheckTimer) {
      clearInterval(this.authCheckTimer);
      this.authCheckTimer = null;
    }
  }

  // Redirect to admin app with auth context
  redirectToAdmin() {
    const adminUrl = import.meta.env.VITE_ADMIN_APP_URL || 'http://localhost:3000';
    // Since admin is running on this port, just return or stay on current page
    if (adminUrl === window.location.origin) {
      console.log('Already on admin app');
    } else {
      window.open(adminUrl, '_blank');
    }
  }

  // Redirect to main app with auth context
  redirectToMainApp() {
    const mainUrl = import.meta.env.VITE_MAIN_APP_URL || 'http://localhost:4000';
    window.open(mainUrl, '_blank');
  }
}

// Export singleton instance
export const authService = new SharedAuthService();

// Export for both CommonJS and ES modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { authService };
}
