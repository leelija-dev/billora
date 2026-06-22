// components/features/Sellers/SellerForm.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiX, FiUser, FiMail, FiPhone, FiMapPin, FiFileText, FiAlertCircle } from 'react-icons/fi';
import Button from '../../common/Button/Button';
import Input from '../../common/Input/Input';
import { useAuthStore } from '../../../store/authStore';
import {
  validatePhone,
  validateEmail,
  validateGSTNumber,
  handlePhoneInput,
  handleAlphanumericInput,
  handleGSTInput,
  validationRules,
} from '../../../utils/validators';

const SellerForm = ({ seller, onSubmit, onCancel, isSubmitting, isEdit }) => {
  const { user } = useAuthStore();

  // Get current user ID
  const getUserId = () => {
    if (user && user.id) {
      return user.id.toString();
    }
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      try {
        const parsed = JSON.parse(authStorage);
        const userId = parsed.state?.user?.id || parsed.user?.id;
        return userId ? userId.toString() : '1';
      } catch (error) {
        console.error('Error parsing auth storage:', error);
        return '1';
      }
    }
    const authData = localStorage.getItem('auth');
    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        return parsed.user?.id || parsed.userId || '1';
      } catch {
        return '1';
      }
    }
    return '1';
  };

  const currentUserId = getUserId();

  const [formData, setFormData] = useState({
    user_id: currentUserId,
    name: '',
    email: '',
    phone: '',
    gst_number: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (seller) {
      setFormData({
        user_id: seller.user_id || seller.userId || currentUserId,
        name: seller.name || '',
        email: seller.email || '',
        phone: seller.phone || '',
        gst_number: seller.gst_number || '',
        address: seller.address || '',
        city: seller.city || '',
        state: seller.state || '',
        pincode: seller.pincode || '',
      });
    } else {
      setFormData(prev => ({
        ...prev,
        user_id: currentUserId,
      }));
    }
  }, [seller, currentUserId]);

  // Validation functions
  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value || value.trim() === '') {
          return 'Seller name is required';
        }
        if (value.trim().length < 2) {
          return 'Name must be at least 2 characters';
        }
        if (value.trim().length > 100) {
          return 'Name cannot exceed 100 characters';
        }
        if (!/^[a-zA-Z\s.-]+$/.test(value)) {
          return 'Name can only contain letters, spaces, dots, and hyphens';
        }
        return '';

      case 'phone':
        if (value && !validatePhone(value)) {
          return validationRules.mobile.message;
        }
        return '';

      case 'email':
        if (value && !validateEmail(value)) {
          return validationRules.email.message;
        }
        return '';

      case 'gst_number':
        if (value && !validateGSTNumber(value)) {
          return validationRules.gstNumber.message;
        }
        return '';

      case 'address':
        if (value && value.length > 500) {
          return 'Address cannot exceed 500 characters';
        }
        return '';

      case 'city':
        if (value && !/^[a-zA-Z\s-]+$/.test(value)) {
          return 'City can only contain letters, spaces, and hyphens';
        }
        return '';

      case 'state':
        if (value && !/^[a-zA-Z\s-]+$/.test(value)) {
          return 'State can only contain letters, spaces, and hyphens';
        }
        return '';

      case 'pincode':
        if (value && !/^[0-9]{6}$/.test(value)) {
          return 'Please enter a valid 6-digit pincode';
        }
        return '';

      default:
        return '';
    }
  };

  // Real-time input handlers
  const handlePhoneChange = (e) => {
    handlePhoneInput(e);
    const value = e.target.value;
    setFormData(prev => ({ ...prev, phone: value }));

    const error = validateField('phone', value);
    if (error) {
      setErrors(prev => ({ ...prev, phone: error }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.phone;
        return newErrors;
      });
    }
  };

  const handleGSTChange = (e) => {
    handleGSTInput(e);
    const value = e.target.value;
    setFormData(prev => ({ ...prev, gst_number: value }));

    const error = validateField('gst_number', value);
    if (error) {
      setErrors(prev => ({ ...prev, gst_number: error }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.gst_number;
        return newErrors;
      });
    }
  };

  const handleCityChange = (e) => {
    handleAlphanumericInput(e);
    const value = e.target.value;
    setFormData(prev => ({ ...prev, city: value }));

    const error = validateField('city', value);
    if (error) {
      setErrors(prev => ({ ...prev, city: error }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.city;
        return newErrors;
      });
    }
  };

  const handleStateChange = (e) => {
    handleAlphanumericInput(e);
    const value = e.target.value;
    setFormData(prev => ({ ...prev, state: value }));

    const error = validateField('state', value);
    if (error) {
      setErrors(prev => ({ ...prev, state: error }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.state;
        return newErrors;
      });
    }
  };

  const handleNameChange = (e) => {
    let value = e.target.value;
    // Allow letters, spaces, dots, and hyphens only
    value = value.replace(/[^a-zA-Z\s.-]/g, '');
    e.target.value = value;
    setFormData(prev => ({ ...prev, name: value }));

    const error = validateField('name', value);
    if (error) {
      setErrors(prev => ({ ...prev, name: error }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.name;
        return newErrors;
      });
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, email: value }));

    const error = validateField('email', value);
    if (error) {
      setErrors(prev => ({ ...prev, email: error }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.email;
        return newErrors;
      });
    }
  };

  const handleAddressChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, address: value }));

    const error = validateField('address', value);
    if (error) {
      setErrors(prev => ({ ...prev, address: error }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.address;
        return newErrors;
      });
    }
  };

  const handlePincodeChange = (e) => {
    let value = e.target.value;
    // Allow only digits
    value = value.replace(/\D/g, '');
    // Limit to 6 digits
    if (value.length <= 6) {
      e.target.value = value;
      setFormData(prev => ({ ...prev, pincode: value }));

      const error = validateField('pincode', value);
      if (error) {
        setErrors(prev => ({ ...prev, pincode: error }));
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.pincode;
          return newErrors;
        });
      }
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field]);
    if (error) {
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    const nameError = validateField('name', formData.name);
    if (nameError) newErrors.name = nameError;

    // Optional fields validation
    if (formData.email && formData.email.trim() !== '') {
      const emailError = validateField('email', formData.email);
      if (emailError) newErrors.email = emailError;
    }

    if (formData.phone && formData.phone.trim() !== '') {
      const phoneError = validateField('phone', formData.phone);
      if (phoneError) newErrors.phone = phoneError;
    }

    if (formData.gst_number && formData.gst_number.trim() !== '') {
      const gstError = validateField('gst_number', formData.gst_number);
      if (gstError) newErrors.gst_number = gstError;
    }

    if (formData.address && formData.address.trim() !== '') {
      const addressError = validateField('address', formData.address);
      if (addressError) newErrors.address = addressError;
    }

    if (formData.city && formData.city.trim() !== '') {
      const cityError = validateField('city', formData.city);
      if (cityError) newErrors.city = cityError;
    }

    if (formData.state && formData.state.trim() !== '') {
      const stateError = validateField('state', formData.state);
      if (stateError) newErrors.state = stateError;
    }

    if (formData.pincode && formData.pincode.trim() !== '') {
      const pincodeError = validateField('pincode', formData.pincode);
      if (pincodeError) newErrors.pincode = pincodeError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mark all fields as touched
    const allFields = ['name', 'email', 'phone', 'gst_number', 'address', 'city', 'state', 'pincode'];
    const touchedObj = {};
    allFields.forEach(field => {
      touchedObj[field] = true;
    });
    setTouched(touchedObj);

    if (validateForm()) {
      // Clean up data before submitting
      const cleanData = {
        user_id: currentUserId,
        name: formData.name.trim(),
        email: formData.email?.trim() || null,
        phone: formData.phone?.trim() || null,
        gst_number: formData.gst_number?.trim() || null,
        address: formData.address?.trim() || null,
        city: formData.city?.trim() || null,
        state: formData.state?.trim() || null,
        pincode: formData.pincode?.trim() || null,
      };
      onSubmit(cleanData);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {isEdit ? 'Edit Seller' : 'Add New Seller'}
        </h2>
        <button
          onClick={onCancel}
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <FiX className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name - Required */}
          <div className="md:col-span-2">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Seller Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleNameChange}
                onBlur={() => handleBlur('name')}
                placeholder="Enter seller name"
                className={`w-full px-3 py-2 h-[42px] border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors ${
                  errors.name && touched.name
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                disabled={isSubmitting}
              />
              {errors.name && touched.name && (
                <div className="flex items-center space-x-1 mt-1">
                  <FiAlertCircle className="w-4 h-4 text-red-500" />
                  <p className="text-red-500 text-sm">{errors.name}</p>
                </div>
              )}
              {!errors.name && touched.name && formData.name && (
                <p className="text-xs text-green-500 mt-1">✓ Valid name</p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Letters, spaces, dots, and hyphens only (2-100 characters)
              </p>
            </div>
          </div>

          {/* Email - Optional */}
          <div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Address <span className="text-gray-400 text-xs">(Optional)</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleEmailChange}
                onBlur={() => handleBlur('email')}
                placeholder="seller@example.com"
                className={`w-full px-3 py-2 h-[42px] border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors ${
                  errors.email && touched.email
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                disabled={isSubmitting}
              />
              {errors.email && touched.email && (
                <div className="flex items-center space-x-1 mt-1">
                  <FiAlertCircle className="w-4 h-4 text-red-500" />
                  <p className="text-red-500 text-sm">{errors.email}</p>
                </div>
              )}
              {!errors.email && formData.email && validateEmail(formData.email) && (
                <p className="text-xs text-green-500 mt-1">✓ Valid email address</p>
              )}
            </div>
          </div>

          {/* Phone - Optional */}
          <div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Phone Number <span className="text-gray-400 text-xs">(Optional)</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handlePhoneChange}
                onBlur={() => handleBlur('phone')}
                placeholder="Enter 10-digit phone number"
                className={`w-full px-3 py-2 h-[42px] border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors ${
                  errors.phone && touched.phone
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                disabled={isSubmitting}
              />
              {errors.phone && touched.phone && (
                <div className="flex items-center space-x-1 mt-1">
                  <FiAlertCircle className="w-4 h-4 text-red-500" />
                  <p className="text-red-500 text-sm">{errors.phone}</p>
                </div>
              )}
              {!errors.phone && formData.phone && formData.phone.length === 10 && (
                <p className="text-xs text-green-500 mt-1">✓ Valid phone number</p>
              )}
              {!errors.phone && formData.phone && formData.phone.length > 0 && formData.phone.length !== 10 && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Exactly 10 digits required
                </p>
              )}
            </div>
          </div>

          {/* GST Number - Optional */}
          <div className="md:col-span-2">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                GST Number <span className="text-gray-400 text-xs">(Optional)</span>
              </label>
              <input
                type="text"
                name="gst_number"
                value={formData.gst_number}
                onChange={handleGSTChange}
                onBlur={() => handleBlur('gst_number')}
                placeholder="Enter GST number (e.g., 27ABCDE1234F2Z5)"
                className={`w-full px-3 py-2 h-[42px] border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors ${
                  errors.gst_number && touched.gst_number
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                disabled={isSubmitting}
              />
              {errors.gst_number && touched.gst_number && (
                <div className="flex items-center space-x-1 mt-1">
                  <FiAlertCircle className="w-4 h-4 text-red-500" />
                  <p className="text-red-500 text-sm">{errors.gst_number}</p>
                </div>
              )}
              {!errors.gst_number && formData.gst_number && validateGSTNumber(formData.gst_number) && (
                <p className="text-xs text-green-500 mt-1">✓ Valid GST number</p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Format: 15 characters (e.g., 27ABCDE1234F2Z5)
              </p>
            </div>
          </div>

          {/* Address - Optional */}
          <div className="md:col-span-2">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Address <span className="text-gray-400 text-xs">(Optional)</span>
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleAddressChange}
                onBlur={() => handleBlur('address')}
                placeholder="Enter full address"
                rows="3"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors ${
                  errors.address && touched.address
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                disabled={isSubmitting}
              />
              {errors.address && touched.address && (
                <div className="flex items-center space-x-1 mt-1">
                  <FiAlertCircle className="w-4 h-4 text-red-500" />
                  <p className="text-red-500 text-sm">{errors.address}</p>
                </div>
              )}
              {formData.address && formData.address.length > 400 && (
                <p className="text-xs text-orange-500 mt-1">
                  ⚠️ {formData.address.length}/500 characters
                </p>
              )}
            </div>
          </div>

          {/* City - Optional */}
          <div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                City <span className="text-gray-400 text-xs">(Optional)</span>
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleCityChange}
                onBlur={() => handleBlur('city')}
                placeholder="Enter city"
                className={`w-full px-3 py-2 h-[42px] border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors ${
                  errors.city && touched.city
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                disabled={isSubmitting}
              />
              {errors.city && touched.city && (
                <div className="flex items-center space-x-1 mt-1">
                  <FiAlertCircle className="w-4 h-4 text-red-500" />
                  <p className="text-red-500 text-sm">{errors.city}</p>
                </div>
              )}
              {!errors.city && formData.city && (
                <p className="text-xs text-green-500 mt-1">✓ Valid city name</p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Only letters, spaces, and hyphens allowed
              </p>
            </div>
          </div>

          {/* State - Optional */}
          <div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                State <span className="text-gray-400 text-xs">(Optional)</span>
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleStateChange}
                onBlur={() => handleBlur('state')}
                placeholder="Enter state"
                className={`w-full px-3 py-2 h-[42px] border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors ${
                  errors.state && touched.state
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                disabled={isSubmitting}
              />
              {errors.state && touched.state && (
                <div className="flex items-center space-x-1 mt-1">
                  <FiAlertCircle className="w-4 h-4 text-red-500" />
                  <p className="text-red-500 text-sm">{errors.state}</p>
                </div>
              )}
              {!errors.state && formData.state && (
                <p className="text-xs text-green-500 mt-1">✓ Valid state name</p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Only letters, spaces, and hyphens allowed
              </p>
            </div>
          </div>

          {/* Pincode - Optional */}
          <div className="md:col-span-2 max-w-xs">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Pincode <span className="text-gray-400 text-xs">(Optional)</span>
              </label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handlePincodeChange}
                onBlur={() => handleBlur('pincode')}
                placeholder="Enter 6-digit pincode"
                className={`w-full px-3 py-2 h-[42px] border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors ${
                  errors.pincode && touched.pincode
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                disabled={isSubmitting}
                maxLength={6}
              />
              {errors.pincode && touched.pincode && (
                <div className="flex items-center space-x-1 mt-1">
                  <FiAlertCircle className="w-4 h-4 text-red-500" />
                  <p className="text-red-500 text-sm">{errors.pincode}</p>
                </div>
              )}
              {!errors.pincode && formData.pincode && formData.pincode.length === 6 && (
                <p className="text-xs text-green-500 mt-1">✓ Valid pincode</p>
              )}
              {!errors.pincode && formData.pincode && formData.pincode.length > 0 && formData.pincode.length !== 6 && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Exactly 6 digits required
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Required Fields Indicator */}
        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center space-x-2">
          <span className="text-red-500">*</span>
          <span>Required fields</span>
        </div>

        {/* Error Summary */}
        {Object.keys(errors).length > 0 && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <FiAlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-red-800 dark:text-red-200">
                  Please fix the following errors:
                </h4>
                <ul className="mt-2 list-disc list-inside text-sm text-red-700 dark:text-red-300">
                  {Object.entries(errors).map(([field, message]) => (
                    <li key={field}>
                      {field === 'name' ? 'Name' :
                       field === 'phone' ? 'Phone Number' :
                       field === 'gst_number' ? 'GST Number' :
                       field === 'pincode' ? 'Pincode' :
                       field.charAt(0).toUpperCase() + field.slice(1)}: {message}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="w-full sm:w-auto"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white mr-2"></div>
                {isEdit ? 'Updating...' : 'Creating...'}
              </div>
            ) : (
              isEdit ? 'Update Seller' : 'Create Seller'
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default SellerForm;