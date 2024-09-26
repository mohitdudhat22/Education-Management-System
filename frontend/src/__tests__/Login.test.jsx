import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useAuth } from '../contexts/AuthContext';
import { BrowserRouter as Router } from 'react-router-dom';
import Login from '../components/Login';

// Mock the useAuth context using Vitest
vi.mock('../contexts/AuthContext', () => ({
    useAuth: () => ({
      login: vi.fn(), // Mocking the login function
    }),
  }));
  
  describe('Login Component', () => {
    const mockLogin = useAuth().login; // Get the mocked login function
  
    beforeEach(() => {
      render(
        <Router>
          <Login />
        </Router>
      );
    });
  
    test('renders login form', () => {
        expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
        expect(screen.getByText(/User Login/i)).toBeInTheDocument();
    });

    test('submits the form with correct credentials', async () => {
        mockLogin.mockResolvedValue(true); // Simulate successful login
      
        // Simulate entering credentials
        fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'mohit@gmail.com' } });
        fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: 'password123' } });
        // Simulate clicking the login button using getByRole
        fireEvent.click(screen.getByRole('button', { name: /Login/i }));
      
        console.log(mockLogin.mock.calls); 
        // Ensure the mockLogin function is called with correct arguments
        await waitFor(() => {
          expect(mockLogin).toHaveBeenCalledWith('mohit@gmail.com', 'password123');
        });
      });
      
  
    // test('shows error on failed login', async () => {
    //   mockLogin.mockResolvedValue(false); // Simulate failed login
  
    //   // Simulate entering wrong credentials
    //   fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'test@example.com' } });
    //   fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: 'wrongpassword' } });
  
    //   // Simulate clicking the login button
    //   fireEvent.click(screen.getByText(/Login/i));
    //   console.log(mockLogin.mock.calls);
    //   // Check if mockLogin was called with the wrong password
    //   await waitFor(() => {
    //     expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'wrongpassword');
    //   });
  
    //   // Optionally, add assertions to check for any error message
    //   // Example: Assuming an error message is shown on login failure
    //   // expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
    // });
  });