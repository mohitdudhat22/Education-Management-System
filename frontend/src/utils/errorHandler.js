// src/utils/errorHandler.js
import { toast } from 'react-toastify';

export const handleApiError = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    toast.error(error.response.data.message || 'An error occurred');
  } else if (error.request) {
    // The request was made but no response was received
    toast.error('No response from server');
  } else {
    // Something happened in setting up the request that triggered an Error
    toast.error('Error setting up the request');
  }
};