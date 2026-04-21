// store/contactStore.js - Zustand store for contact form management
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { logger } from '../utils/logger';
import { submitContactForm } from '../services/contactService';

// Create Zustand store for contact
export const useContactStore = create(
  persist(
    (set, get) => ({
      // State
      formData: {
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      },
      loading: false,
      error: null,
      success: null,
      submissionHistory: [],

      // Actions
      /**
       * Update form field
       * @param {string} field - Field name
       * @param {string} value - Field value
       */
      updateFormField: (field, value) => {
        set((state) => ({
          formData: {
            ...state.formData,
            [field]: value
          }
        }));
      },

      /**
       * Set entire form data
       * @param {Object} data - Form data object
       */
      setFormData: (data) => {
        set({ formData: data });
      },

      /**
       * Submit contact form
       * @returns {Promise<Object>} Submission result
       */
      submitContactForm: async () => {
        const state = get();
        
        // Validate required fields
        if (!state.formData.name?.trim()) {
          set({ error: 'Name is required' });
          return { success: false, error: 'Name is required' };
        }

        if (!state.formData.email?.trim()) {
          set({ error: 'Email is required' });
          return { success: false, error: 'Email is required' };
        }

        if (!state.formData.message?.trim()) {
          set({ error: 'Message is required' });
          return { success: false, error: 'Message is required' };
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(state.formData.email)) {
          set({ error: 'Please enter a valid email address' });
          return { success: false, error: 'Please enter a valid email address' };
        }

        set({ loading: true, error: null, success: null });

        try {
          logger.log('🔄 Submitting contact form...');
          const response = await submitContactForm(state.formData);
          
          // Add to submission history
          const newSubmission = {
            ...state.formData,
            timestamp: new Date().toISOString(),
            status: 'success'
          };
          
          set({
            loading: false,
            success: 'Message sent successfully!',
            error: null,
            submissionHistory: [...state.submissionHistory, newSubmission]
          });

          logger.log('✅ Contact form submitted successfully');
          
          // Reset form after successful submission
          setTimeout(() => {
            set({
              formData: {
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: '',
              },
              success: null
            });
          }, 2000);

          return { success: true, data: response };
        } catch (error) {
          logger.error('❌ Contact form submission error:', error);
          
          // Add failed submission to history
          const failedSubmission = {
            ...state.formData,
            timestamp: new Date().toISOString(),
            status: 'failed',
            error: error.message
          };
          
          set({
            loading: false,
            error: error.message || 'Failed to send message',
            success: null,
            submissionHistory: [...state.submissionHistory, failedSubmission]
          });

          return { success: false, error: error.message || 'Failed to send message' };
        }
      },

      /**
       * Reset form to initial state
       */
      resetForm: () => {
        set({
          formData: {
            name: '',
            email: '',
            phone: '',
            subject: '',
            message: '',
          },
          loading: false,
          error: null,
          success: null
        });
      },

      /**
       * Clear error state
       */
      clearError: () => {
        set({ error: null });
      },

      /**
       * Clear success message
       */
      clearSuccess: () => {
        set({ success: null });
      },

      /**
       * Clear submission history
       */
      clearSubmissionHistory: () => {
        set({ submissionHistory: [] });
      },
    }),
    {
      name: 'contact-store',
      partialize: (state) => ({
        formData: state.formData,
        submissionHistory: state.submissionHistory.slice(-10), // Keep last 10 submissions
      }),
      onRehydrateStorage: () => (state) => {
        logger.log('🔄 Contact store rehydrated');
        if (state) {
          state.loading = false;
          state.error = null;
          state.success = null;
        }
      },
    }
  )
);

export default useContactStore;
