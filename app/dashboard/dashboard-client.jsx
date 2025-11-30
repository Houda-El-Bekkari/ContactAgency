'use client';

import { useAuth, UserButton } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export function DashboardClient() {
  const { isLoaded, userId, isSignedIn } = useAuth();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState('');
  const [isHovered, setIsHovered] = useState({ agencies: false, contacts: false });

  // Synchronize user automatically
  const syncUser = async (userId) => {
    try {
      setSyncStatus('Synchronization in progress...');
      const response = await fetch('/api/sync-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setSyncStatus('Synchronization successful!');
        setTimeout(() => setSyncStatus(''), 3000);
        return userData;
      } else {
        const error = await response.json();
        setSyncStatus('Synchronization error');
        throw new Error(error.error);
      }
    } catch (error) {
      console.error('Error syncing user:', error);
      setSyncStatus('Synchronization error');
      return null;
    }
  };

  // Load user
  const loadUser = async (userId) => {
    try {
      // Try to retrieve existing user
      const userResponse = await fetch(`/api/users/${userId}`);
      
      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUser(userData);
        return userData;
      } else {
        // If user doesn't exist, auto-sync
        console.log('User not found in database, auto-syncing...');
        return await syncUser(userId);
      }
    } catch (error) {
      console.error('Error loading user:', error);
      return null;
    }
  };

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in');
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    if (userId && isSignedIn) {
      loadUser(userId).finally(() => {
        setLoading(false);
      });
    }
  }, [userId, isSignedIn]);

  const handleManualSync = async () => {
    if (userId) {
      await syncUser(userId);
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-purple-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading and synchronizing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-purple-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl transform group-hover:rotate-12 transition-transform duration-300 shadow-lg"></div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-700 bg-clip-text text-transparent">
                ContactAgency
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Dashboard <span className="bg-gradient-to-r from-purple-600 to-indigo-700 bg-clip-text text-transparent"></span>
          </h1>
          <p className="text-xl text-gray-600">
            Welcome{user ? `, ${user.firstName} ${user.lastName}` : ' to your personal space'}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Agencies Card */}
          <Link 
            href="/agencies"
            className="group relative bg-white border border-purple-200 rounded-2xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-purple-300 hover:shadow-purple-200"
            onMouseEnter={() => setIsHovered(prev => ({ ...prev, agencies: true }))}
            onMouseLeave={() => setIsHovered(prev => ({ ...prev, agencies: false }))}
          >
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white mb-6 transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Agency Management
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Explore and manage your network of partner agencies with advanced tools and an intuitive interface.
            </p>
            <div className="flex items-center text-purple-600 font-semibold">
              Access agencies
              <svg className={`w-5 h-5 ml-2 transform transition-transform duration-300 ${isHovered.agencies ? 'translate-x-2' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
          </Link>

          {/* Contacts Card */}
          <Link 
            href="/contacts"
            className="group relative bg-white border border-purple-200 rounded-2xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-purple-300 hover:shadow-purple-200"
            onMouseEnter={() => setIsHovered(prev => ({ ...prev, contacts: true }))}
            onMouseLeave={() => setIsHovered(prev => ({ ...prev, contacts: false }))}
          >
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white mb-6 transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Contact Database
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Access your professional contact network with a generous limit of 50 consultations per day.
            </p>
            <div className="flex items-center text-indigo-600 font-semibold">
              View contacts
              <svg className={`w-5 h-5 ml-2 transform transition-transform duration-300 ${isHovered.contacts ? 'translate-x-2' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
          </Link>
        </div>

        {/* Account Information */}
        <div className="bg-white border border-purple-200 rounded-2xl p-8 shadow-lg">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 lg:mb-0">
              Account <span className="bg-gradient-to-r from-purple-600 to-indigo-700 bg-clip-text text-transparent">Information</span>
            </h2>
            
            {(!user || syncStatus) && (
              <div className="flex items-center space-x-4">
                {syncStatus && (
                  <span className={`text-sm font-medium ${
                    syncStatus.includes('successful') ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {syncStatus}
                  </span>
                )}
                <button
                  onClick={handleManualSync}
                  disabled={syncStatus === 'Synchronization in progress...'}
                  className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-200 transform hover:-translate-y-1 disabled:opacity-50"
                >
                  {syncStatus === 'Synchronization in progress...' ? 'Synchronizing...' : 'Synchronize'}
                </button>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
                <p className="text-purple-800 text-sm font-semibold mb-2">User ID</p>
                <p className="text-gray-900 font-mono text-sm truncate bg-white px-3 py-2 rounded-lg border border-purple-200">{userId}</p>
              </div>
              
              {user ? (
                <>
                  <div className="bg-white rounded-2xl p-6 border border-purple-200">
                    <p className="text-gray-600 text-sm font-medium mb-2">Email</p>
                    <p className="text-gray-900 text-lg">{user.email}</p>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-6 border border-purple-200">
                    <p className="text-gray-600 text-sm font-medium mb-2">Full name</p>
                    <p className="text-gray-900 text-lg">{user.firstName} {user.lastName}</p>
                  </div>
                </>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-yellow-800 font-semibold mb-2">Synchronization required</p>
                      <p className="text-yellow-700 text-sm">
                        Your account is being synchronized with the database.
                        Click "Synchronize" if it takes too long.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {user && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-200">
                  <p className="text-gray-600 text-sm font-medium mb-3">Consultation status</p>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-gray-900 text-3xl font-bold">{user.dailyContactViews}/50</p>
                    <span className="text-purple-600 text-sm font-semibold bg-white px-3 py-1 rounded-full border border-purple-200">
                      Today
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-indigo-600 h-3 rounded-full transition-all duration-500 shadow-inner"
                      style={{ width: `${Math.min((user.dailyContactViews / 50) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl p-6 border border-purple-200">
                  <p className="text-gray-600 text-sm font-medium mb-2">Premium Status</p>
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${user.isPremium ? 'bg-gradient-to-r from-purple-500 to-indigo-600 animate-pulse' : 'bg-gray-400'}`}></div>
                    <p className="text-gray-900 font-semibold">
                      {user.isPremium ? (
                        <span className="bg-gradient-to-r from-purple-600 to-indigo-700 bg-clip-text text-transparent">
                          Premium Account
                        </span>
                      ) : (
                        'Standard Account'
                      )}
                    </p>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl p-6 border border-purple-200">
                  <p className="text-gray-600 text-sm font-medium mb-2">Member since</p>
                  <p className="text-gray-900 text-lg">
                    {new Date(user.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}