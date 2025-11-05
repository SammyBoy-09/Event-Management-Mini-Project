import apiService, { API_ENDPOINTS } from './apiService';
import { mockUsers } from '../data/mockData';

class AuthService {
  // Login user
  async login(email, password) {
    try {
      const response = await apiService.post(API_ENDPOINTS.AUTH.LOGIN, {
        email,
        password,
      });

      if (response.success) {
        // Store token and user data
        await this.setAuthData(response.data.token, response.data.student);
        return {
          user: response.data.student,
          token: response.data.token
        };
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Register new user
  async register(userData) {
    try {
      const response = await apiService.post(API_ENDPOINTS.AUTH.REGISTER, userData);

      if (response.success) {
        // Store token and user data
        await this.setAuthData(response.data.token, response.data.student);
        return {
          user: response.data.student,
          token: response.data.token
        };
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  // Logout user
  async logout() {
    try {
      // TODO: Replace with actual API call
      // await apiService.post(API_ENDPOINTS.AUTH.LOGOUT);

      // Clear auth token
      apiService.setAuthToken(null);

      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  // Refresh authentication token
  async refreshToken(refreshToken) {
    try {
      // TODO: Replace with actual API call
      // const response = await apiService.post(API_ENDPOINTS.AUTH.REFRESH, {
      //   refreshToken,
      // });

      // Mock implementation
      const mockResponse = {
        token: 'mock_jwt_token_refreshed_' + Date.now(),
        refreshToken: 'mock_refresh_token_refreshed_' + Date.now(),
      };

      apiService.setAuthToken(mockResponse.token);

      return mockResponse;
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }

  // Forgot password
  async forgotPassword(email) {
    try {
      // TODO: Replace with actual API call
      // const response = await apiService.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {
      //   email,
      // });

      // Mock implementation
      const user = mockUsers.find(u => u.email === email);
      if (!user) {
        throw new Error('User with this email does not exist');
      }

      return {
        message: 'Password reset link sent to your email',
        success: true,
      };
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  }

  // Reset password
  async resetPassword(token, newPassword) {
    try {
      // TODO: Replace with actual API call
      // const response = await apiService.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
      //   token,
      //   password: newPassword,
      // });

      // Mock implementation
      return {
        message: 'Password reset successfully',
        success: true,
      };
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }

  // Helper method to store auth data
  async setAuthData(token, user) {
    try {
      // Set token for API requests
      apiService.setAuthToken(token);
      
      // Store in AsyncStorage (you may want to implement this)
      // await AsyncStorage.setItem('authToken', token);
      // await AsyncStorage.setItem('userData', JSON.stringify(user));
    } catch (error) {
      console.error('Error storing auth data:', error);
    }
  }
}

export const authService = new AuthService();
export default authService;
