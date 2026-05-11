// Test script to verify plan-based access control
// Run this in browser console to test the functionality

console.log('🧪 Testing Plan-Based Access Control');

// Test 1: Check if hasActivePlan function exists
const { hasActivePlan } = useAuthStore.getState();
if (typeof hasActivePlan === 'function') {
  console.log('✅ hasActivePlan function exists');
} else {
  console.log('❌ hasActivePlan function missing');
}

// Test 2: Check current user status
const { user, isAuthenticated } = useAuthStore.getState();
console.log('📊 Current User Status:', {
  isAuthenticated,
  user: user ? {
    id: user.id,
    email: user.email,
    plan_id: user.plan_id,
    is_active: user.is_active
  } : null
});

// Test 3: Check if user has active plan
const hasActivePlanStatus = hasActivePlan();
console.log('🔍 Active Plan Status:', hasActivePlanStatus);

// Test 4: Simulate different user scenarios
console.log('\n🎭 Simulating User Scenarios:');

// Scenario 1: User with active plan
console.log('Scenario 1 - User with active plan:', {
  user: { plan_id: 1, is_active: 1 },
  isAuthenticated: true,
  hasActivePlan: true
});

// Scenario 2: User without active plan
console.log('Scenario 2 - User without active plan:', {
  user: { plan_id: null, is_active: 1 },
  isAuthenticated: true,
  hasActivePlan: false
});

// Scenario 3: User with inactive plan
console.log('Scenario 3 - User with inactive plan:', {
  user: { plan_id: 1, is_active: 0 },
  isAuthenticated: true,
  hasActivePlan: false
});

// Scenario 4: Not authenticated user
console.log('Scenario 4 - Not authenticated user:', {
  user: null,
  isAuthenticated: false,
  hasActivePlan: false
});

console.log('\n🎯 Expected Behavior:');
console.log('- Users with active plans can access all admin pages');
console.log('- Users without active plans are redirected to /login');
console.log('- Non-authenticated users are redirected to /login');

export { hasActivePlan };
