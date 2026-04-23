import { apiRequest } from '../utils/api';
import { logger } from '../utils/logger';

class TestimonialService {
  async getAllTestimonials(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const endpoint = `/testimonial${queryString ? `?${queryString}` : ''}`;

      const response = await apiRequest(endpoint, 'GET');

      logger.log("FULL RESPONSE:", response);

      let testimonialsData = [];

      // ✅ FIX: handle "All Testimonials"
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
}

export default new TestimonialService();