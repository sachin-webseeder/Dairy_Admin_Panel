/**
 * API Testing Utility
 *
 * Use this file to test your API integration
 * Run in browser console or create a test page
 */

import { authService, customerService, orderService, productService } from './services';
import { API_CONFIG } from './config';

/**
 * Test API Connection
 */
export async function testApiConnection() {
  console.group('🔍 Testing API Connection');
  console.log('Base URL:', API_CONFIG.BASE_URL);
  console.log('API Enabled:', API_CONFIG.ENABLE_API);
  console.groupEnd();

  if (!API_CONFIG.ENABLE_API) {
    console.warn('⚠️ API is disabled. Set ENABLE_API to true in config to test API.');
    return;
  }

  try {
    const response = await fetch(API_CONFIG.BASE_URL);
    console.log('✅ API server is reachable');
    return true;
  } catch (error) {
    console.error('❌ Cannot reach API server:', error);
    return false;
  }
}

/**
 * Test Authentication
 */
export async function testAuth(email = 'admin@example.com', password = 'password123') {
  console.group('🔐 Testing Authentication');
  
  try {
    console.log('Attempting login...');
    const result = await authService.login({ email, password });
    
    if (result.success) {
      console.log('✅ Login successful!');
      console.log('User:', result.data.user);
      console.log('Token stored:', !!localStorage.getItem('auth_token'));
      return result;
    } else {
      console.error('❌ Login failed:', result.error);
      return null;
    }
  } catch (error) {
    console.error('❌ Login error:', error.message);
    return null;
  } finally {
    console.groupEnd();
  }
}

/**
 * Test Customer APIs
 */
export async function testCustomers() {
  console.group('👥 Testing Customer APIs');

  try {
    // Test GET customers
    console.log('1. Testing GET /customers...');
    const listResult = await customerService.getCustomers({ page: 1, limit: 5 });
    if (listResult.success) {
      console.log('✅ GET customers:', listResult.data);
    } else {
      console.error('❌ GET customers failed');
    }

    // Test CREATE customer
    console.log('2. Testing POST /customers...');
    const newCustomer = {
      name: 'Test Customer',
      email: `test${Date.now()}@example.com`,
      phone: '+971501234567',
      address: 'Test Address',
      membership: 'Bronze',
    };
    const createResult = await customerService.createCustomer(newCustomer);
    if (createResult.success) {
      console.log('✅ CREATE customer:', createResult.data);
      
      // Test GET single customer
      const customerId = createResult.data.id;
      console.log('3. Testing GET /customers/:id...');
      const getResult = await customerService.getCustomer(customerId);
      if (getResult.success) {
        console.log('✅ GET customer:', getResult.data);
      }

      // Test UPDATE customer
      console.log('4. Testing PUT /customers/:id...');
      const updateResult = await customerService.updateCustomer(customerId, {
        name: 'Updated Test Customer',
        membership: 'Silver',
      });
      if (updateResult.success) {
        console.log('✅ UPDATE customer:', updateResult.data);
      }

      // Test DELETE customer
      console.log('5. Testing DELETE /customers/:id...');
      const deleteResult = await customerService.deleteCustomer(customerId);
      if (deleteResult.success) {
        console.log('✅ DELETE customer successful');
      }
    } else {
      console.error('❌ CREATE customer failed');
    }

  } catch (error) {
    console.error('❌ Customer API test error:', error.message);
  } finally {
    console.groupEnd();
  }
}

/**
 * Test Order APIs
 */
export async function testOrders() {
  console.group('📦 Testing Order APIs');

  try {
    // Test GET orders
    console.log('1. Testing GET /orders...');
    const listResult = await orderService.getOrders({ page: 1, limit: 5 });
    if (listResult.success) {
      console.log('✅ GET orders:', listResult.data);
    } else {
      console.error('❌ GET orders failed');
    }

  } catch (error) {
    console.error('❌ Order API test error:', error.message);
  } finally {
    console.groupEnd();
  }
}

/**
 * Test Product APIs
 */
export async function testProducts() {
  console.group('🥛 Testing Product APIs');

  try {
    // Test GET products
    console.log('1. Testing GET /products...');
    const listResult = await productService.getProducts({ page: 1, limit: 5 });
    if (listResult.success) {
      console.log('✅ GET products:', listResult.data);
    } else {
      console.error('❌ GET products failed');
    }

  } catch (error) {
    console.error('❌ Product API test error:', error.message);
  } finally {
    console.groupEnd();
  }
}

/**
 * Run All Tests
 */
export async function runAllTests(credentials) {
  console.clear();
  console.log('🚀 Starting API Integration Tests...\n');

  // Test 1: Connection
  const isConnected = await testApiConnection();
  if (!isConnected && API_CONFIG.ENABLE_API) {
    console.error('❌ Cannot proceed without API connection');
    return;
  }

  console.log('\n');

  // Test 2: Authentication
  const authResult = await testAuth(
    credentials?.email || 'admin@example.com',
    credentials?.password || 'password123'
  );
  if (!authResult && API_CONFIG.ENABLE_API) {
    console.error('❌ Cannot proceed without authentication');
    return;
  }

  console.log('\n');

  // Test 3: Customers
  await testCustomers();

  console.log('\n');

  // Test 4: Orders
  await testOrders();

  console.log('\n');

  // Test 5: Products
  await testProducts();

  console.log('\n');
  console.log('✅ All tests completed!');
}

/**
 * Quick test - just check if API is working
 */
export async function quickTest() {
  console.log('🔍 Quick API Test');
  
  if (!API_CONFIG.ENABLE_API) {
    console.log('ℹ️ API is disabled. Using localStorage.');
    return;
  }

  try {
    const result = await authService.login({
      email: 'admin@example.com',
      password: 'password123'
    });
    
    if (result.success) {
      console.log('✅ API is working! User:', result.data.user.name);
      
      const customers = await customerService.getCustomers({ limit: 1 });
      console.log('✅ Customer API working!');
      
    } else {
      console.log('❌ Login failed. Check credentials.');
    }
  } catch (error) {
    console.error('❌ API Error:', error.message);
  }
}

// Expose to window for easy testing in browser console
if (typeof window !== 'undefined') {
  window.apiTest = {
    testConnection: testApiConnection,
    testAuth,
    testCustomers,
    testOrders,
    testProducts,
    runAll: runAllTests,
    quick: quickTest,
  };
  
  console.log('💡 API Test utilities available at window.apiTest');
  console.log('   - apiTest.quick() - Quick connection test');
  console.log('   - apiTest.runAll() - Run all tests');
  console.log('   - apiTest.testAuth() - Test authentication');
  console.log('   - apiTest.testCustomers() - Test customer APIs');
}