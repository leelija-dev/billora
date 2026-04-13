// services/contactService.js
import { apiRequest } from '@/utils/api';

export const submitContactForm = async (formData) => {
  try {
    // Option 1: With full path including /api
    const response = await apiRequest('/contact-us/store', 'POST', formData);
    return response;
  } catch (error) {
    console.error('Contact form submission error:', error);
    throw error;
  }
};