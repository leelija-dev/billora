// services/testimonialService.js
import { apiRequest } from '../utils/api';
import { logger } from '../utils/logger';

class TestimonialService {
  // ✅ Keep existing method for client
  async getAllTestimonials(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const endpoint = `/testimonial${queryString ? `?${queryString}` : ''}`;

      const response = await apiRequest(endpoint, 'GET');

      logger.log("FULL RESPONSE:", response);

      let testimonialsData = [];

      if (response["All Testimonials"]) {
        testimonialsData = response["All Testimonials"];
      } 
      else if (response.data) {
        testimonialsData = response.data;
      } 
      else if (Array.isArray(response)) {
        testimonialsData = response;
      }

      return {
        success: true,
        data: testimonialsData,
      };

    } catch (error) {
      logger.error("Service Error:", error);
      return {
        success: false,
        message: error.message,
        data: [],
      };
    }
  }

  // ✅ FIXED: Server-side method with correct URL
  async getTestimonialsForServer(params = {}) {
    try {
      // ✅ Use the correct base URL from environment or fallback
      const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
      
      // ✅ Build the endpoint
      const queryString = new URLSearchParams(params).toString();
      const endpoint = `/testimonial${queryString ? `?${queryString}` : ''}`;
      const url = `${baseURL}${endpoint}`;
      
      console.log('🔍 Server fetching testimonials from:', url);
      
      const response = await fetch(url, {
        cache: 'force-cache',
        next: { revalidate: 3600 },
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error(`❌ HTTP error! status: ${response.status}, url: ${url}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('📦 Server testimonial response:', data);

      let testimonialsData = [];

      // ✅ Handle the response structure
      if (data["All Testimonials"]) {
        testimonialsData = data["All Testimonials"];
      } 
      else if (data.data) {
        testimonialsData = data.data;
      } 
      else if (Array.isArray(data)) {
        testimonialsData = data;
      }

      return {
        success: true,
        data: testimonialsData,
      };

    } catch (error) {
      console.error('❌ Server error fetching testimonials:', error.message);
      return {
        success: false,
        message: error.message,
        data: [],
      };
    }
  }
}

export default new TestimonialService();