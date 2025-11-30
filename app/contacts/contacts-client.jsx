'use client';

import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export function ContactsClient() {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const router = useRouter();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewsToday, setViewsToday] = useState(0);
  const [limitReached, setLimitReached] = useState(false);
  const [hasPremium, setHasPremium] = useState(false);
  const [expandedContacts, setExpandedContacts] = useState(new Set());
  const itemsPerPage = 10;

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in');
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch('/api/contacts');
        
        if (response.status === 429) {
          const errorData = await response.json();
          setLimitReached(true);
          setViewsToday(errorData.viewsToday);
          setContacts([]);
          return;
        }

        if (response.ok) {
          const data = await response.json();
          setContacts(data.contacts);
          setViewsToday(data.viewsToday);
          setHasPremium(data.hasPremium);
          setLimitReached(false);
        } else {
          console.error('Failed to fetch contacts');
        }
      } catch (error) {
        console.error('Error fetching contacts:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isSignedIn) {
      fetchContacts();
    }
  }, [isSignedIn]);

  const handleViewContact = async (contact) => {
  const isCurrentlyExpanded = expandedContacts.has(contact.id);
  
  console.log('🖱️ Click on contact:', contact.id, 'Currently expanded:', isCurrentlyExpanded);
  
  // If clicking to HIDE details, do NOT count a view
  if (isCurrentlyExpanded) {
    console.log('📤 Hiding contact details');
    setExpandedContacts(prev => {
      const newSet = new Set(prev);
      newSet.delete(contact.id);
      return newSet;
    });
    return;
  }

  console.log('👀 Trying to view contact details...');

  // Track the view ONLY when VIEWING details
  if (!hasPremium) {
    try {
      console.log('📡 Calling view API for contact:', contact.id);
      const response = await fetch(`/api/contacts/${contact.id}/view`, {
        method: 'POST'
      });

      console.log('📨 API Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ View tracked successfully:', data);
        
        // Update counter
        setViewsToday(data.viewsToday);
        
        // Show details even if already viewed
        setExpandedContacts(prev => {
          const newSet = new Set(prev);
          newSet.add(contact.id);
          return newSet;
        });
        
        // Reset limit status if successful
        setLimitReached(false);
        
      } else if (response.status === 429) {
        const errorData = await response.json();
        console.log('⛔ Limit reached from API:', errorData);
        setLimitReached(true);
        setViewsToday(errorData.viewsToday);
        return;
      } else {
        const errorText = await response.text();
        console.error('❌ API Error:', errorText);
      }
    } catch (error) {
      console.error('💥 Error calling view API:', error);
    }
  } else {
    // For premium users, show directly without counting
    console.log('⭐ Premium user, showing details without counting');
    setExpandedContacts(prev => {
      const newSet = new Set(prev);
      newSet.add(contact.id);
      return newSet;
    });
  }
};

  // Filter contacts
  const filteredContacts = contacts.filter(contact =>
    contact.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.agency?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedContacts = filteredContacts.slice(startIndex, startIndex + itemsPerPage);

  // Function to format values
  const formatValue = (value) => {
    if (value === null || value === undefined || value === '') return 'N/A';
    return value.toString();
  };

  const handleUpgradeClick = () => {
    // Simulate upgrade
    setHasPremium(true);
    setLimitReached(false);
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-purple-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading contacts...</p>
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
            <div className="flex items-center space-x-3">
              <Link href="/dashboard" className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl transform group-hover:rotate-12 transition-transform duration-300 shadow-lg"></div>
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-700 bg-clip-text text-transparent">
                  ContactAgency
                </span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-purple-600 font-medium transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/agencies"
                className="text-gray-600 hover:text-purple-600 font-medium transition-colors"
              >
                Agencies
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Contact <span className="bg-gradient-to-r from-purple-600 to-indigo-700 bg-clip-text text-transparent">Database</span>
          </h1>
          <p className="text-gray-600 text-lg">
            Browse contacts - Limit of 50 detailed consultations per day
          </p>
        </div>

        {/* Limit Banner */}
        {limitReached && !hasPremium && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-yellow-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-lg font-semibold text-yellow-800">
                  Daily limit reached!
                </h3>
                <p className="text-yellow-700 mt-1">
                  You have viewed {viewsToday} contacts today. Upgrade to Premium for unlimited access.
                </p>
                <div className="mt-4 flex space-x-4">
                  <button 
                    onClick={handleUpgradeClick}
                    className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105"
                  >
                    Upgrade to Premium
                  </button>
                  <button 
                    onClick={() => setLimitReached(false)}
                    className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Understood
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        {!hasPremium && (
          <div className="bg-white rounded-2xl p-6 border border-purple-200 shadow-lg mb-8">
            <div className="flex justify-between items-center mb-3">
              <div>
                <span className="text-sm font-medium text-gray-700">
                  Detailed consultations today: 
                </span>
                <span className={`ml-2 text-sm font-semibold ${
                  viewsToday >= 45 ? 'text-red-600' : 
                  viewsToday >= 35 ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  {viewsToday}/50
                </span>
              </div>
              <span className="text-sm text-gray-500 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                Resets at midnight
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-500 ${
                  viewsToday >= 45 ? 'bg-red-500' : 
                  viewsToday >= 35 ? 'bg-yellow-500' : 'bg-gradient-to-r from-purple-500 to-indigo-600'
                }`}
                style={{ width: `${Math.min((viewsToday / 50) * 100, 100)}%` }}
              ></div>
            </div>
            {viewsToday >= 40 && !hasPremium && (
              <p className="text-sm text-yellow-600 mt-2">
                ⚠️ Warning: You have {50 - viewsToday} detailed consultations left today.
              </p>
            )}
          </div>
        )}

        {/* Premium Badge */}
        {hasPremium && (
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-4 mb-8 text-white text-center">
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold">Premium Account - Unlimited contact access</span>
            </div>
          </div>
        )}

        {/* Search and Stats */}
        <div className="bg-white rounded-2xl p-6 border border-purple-200 shadow-lg mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex-1 w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for a contact by name, position or agency..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-4 py-3 pl-12 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  disabled={limitReached && !hasPremium}
                />
                <svg
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <div className="bg-purple-50 px-4 py-2 rounded-lg border border-purple-200">
              <p className="text-purple-800 font-semibold">
                {filteredContacts.length} contact{filteredContacts.length !== 1 ? 's' : ''} found
              </p>
            </div>
          </div>
        </div>

        {/* Contacts Table */}
        <div className="bg-white rounded-2xl border border-purple-200 shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-max">
              <thead className="bg-gradient-to-r from-purple-50 to-indigo-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-purple-800 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-purple-800 uppercase tracking-wider">
                    Agency
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-purple-800 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-purple-100">
                {paginatedContacts.length > 0 ? (
                  paginatedContacts.map((contact) => (
                    <ContactRow 
                      key={contact.id}
                      contact={contact}
                      expandedContacts={expandedContacts}
                      onViewContact={handleViewContact}
                      limitReached={limitReached}
                      hasPremium={hasPremium}
                      formatValue={formatValue}
                      viewsToday={viewsToday}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="mt-4 text-lg font-medium">
                          {limitReached && !hasPremium 
                            ? 'Consultation limit reached' 
                            : 'No contacts found'
                          }
                        </p>
                        <p className="mt-2">
                          {limitReached && !hasPremium
                            ? 'Upgrade to Premium to continue viewing contacts'
                            : 'Try modifying your search criteria'
                          }
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white px-6 py-4 border-t border-purple-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages} • 
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredContacts.length)} of {filteredContacts.length} contacts
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-purple-200 rounded-lg text-purple-700 hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-purple-200 rounded-lg text-purple-700 hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/dashboard"
            className="bg-white border border-purple-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group"
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center text-white transform group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Back to Dashboard</h3>
                <p className="text-gray-600">Access your main dashboard</p>
              </div>
            </div>
          </Link>

          <Link
            href="/agencies"
            className="bg-white border border-purple-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group"
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white transform group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">View Agencies</h3>
                <p className="text-gray-600">Explore our network of partner agencies</p>
              </div>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}

// Separate component for each contact row
function ContactRow({ contact, expandedContacts, onViewContact, limitReached, hasPremium, formatValue, viewsToday }) {
  const isExpanded = expandedContacts.has(contact.id);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    await onViewContact(contact);
    setIsLoading(false);
  };

  return (
    <>
      {/* Main row - hidden information */}
      <tr className="hover:bg-purple-50 transition-colors duration-200">
        <td className="px-4 py-3 whitespace-nowrap">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            {formatValue(contact.title)}
          </span>
        </td>
        <td className="px-4 py-3 whitespace-nowrap">
          <div className="text-sm font-semibold text-gray-900">{contact.agency?.name}</div>
          <div className="text-xs text-gray-500">{contact.agency?.state}</div>
        </td>
        <td className="px-4 py-3 whitespace-nowrap">
          <button
            onClick={handleClick}
            disabled={(limitReached && !hasPremium) || isLoading}
            className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Loading...</span>
              </>
            ) : isExpanded ? (
              <span>Hide details</span>
            ) : (
              <span>View this contact</span>
            )}
          </button>
          {isExpanded && !hasPremium && (
            <div className="text-xs text-green-600 mt-1 font-medium">
              ✓ Viewed today
            </div>
          )}
        </td>
      </tr>
      
      {/* Details row - displayed when expanded */}
      {isExpanded && (
        <tr className="bg-purple-25 border-t border-purple-100">
          <td colSpan="3" className="px-4 py-4">
            <div className="bg-white rounded-lg border border-purple-200 p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Contact Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Full name</p>
                  <p className="font-semibold text-gray-900">
                    {formatValue(contact.first_name)} {formatValue(contact.last_name)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  {contact.email ? (
                    <a 
                      href={`mailto:${contact.email}`}
                      className="font-semibold text-purple-600 hover:text-purple-800 hover:underline"
                    >
                      {contact.email}
                    </a>
                  ) : (
                    <p className="font-semibold text-gray-900">N/A</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  {contact.phone ? (
                    <a 
                      href={`tel:${contact.phone}`}
                      className="font-semibold text-gray-900 hover:text-purple-600"
                    >
                      {contact.phone}
                    </a>
                  ) : (
                    <p className="font-semibold text-gray-900">N/A</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-600">Department</p>
                  <p className="font-semibold text-gray-900">{formatValue(contact.department)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email type</p>
                  <p className="font-semibold text-gray-900">{formatValue(contact.email_type)}</p>
                </div>
                {contact.contact_form_url && (
                  <div>
                    <p className="text-sm text-gray-600">Contact form</p>
                    <a 
                      href={contact.contact_form_url.startsWith('http') ? contact.contact_form_url : `https://${contact.contact_form_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-purple-600 hover:text-purple-800 hover:underline break-words"
                    >
                      Form link
                    </a>
                  </div>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}