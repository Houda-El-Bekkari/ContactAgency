'use client';

import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export function AgenciesClient() {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAgency, setSelectedAgency] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const itemsPerPage = 8;

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in');
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    const fetchAgencies = async () => {
      try {
        const response = await fetch('/api/agencies');
        if (response.ok) {
          const data = await response.json();
          setAgencies(data);
        }
      } catch (error) {
        console.error('Error fetching agencies:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isSignedIn) {
      fetchAgencies();
    }
  }, [isSignedIn]);

  // Filter agencies based on search
  const filteredAgencies = agencies.filter(agency =>
    Object.values(agency).some(value => 
      value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Pagination
  const totalPages = Math.ceil(filteredAgencies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAgencies = filteredAgencies.slice(startIndex, startIndex + itemsPerPage);

  const openAgencyDetails = (agency) => {
    setSelectedAgency(agency);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedAgency(null);
  };

  // Function to format values
  const formatValue = (value) => {
    if (value === null || value === undefined || value === '') return 'N/A';
    if (typeof value === 'number') return value.toLocaleString();
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    return value.toString();
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-purple-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading agencies...</p>
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
                href="/contacts"
                className="text-gray-600 hover:text-purple-600 font-medium transition-colors"
              >
                Contacts
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
            List of <span className="bg-gradient-to-r from-purple-600 to-indigo-700 bg-clip-text text-transparent">Agencies</span>
          </h1>
          <p className="text-gray-600 text-lg">
            Discover all partner agencies available in our database
          </p>
        </div>

        {/* Search and Stats */}
        <div className="bg-white rounded-2xl p-6 border border-purple-200 shadow-lg mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex-1 w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search in all columns..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-4 py-3 pl-12 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
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
                {filteredAgencies.length} agenc{filteredAgencies.length !== 1 ? 'ies' : 'y'} found
              </p>
            </div>
          </div>
        </div>

        {/* Agencies Table */}
        <div className="bg-white rounded-2xl border border-purple-200 shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-max">
              <thead className="bg-gradient-to-r from-purple-50 to-indigo-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-purple-800 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-purple-800 uppercase tracking-wider">
                    State/Code
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-purple-800 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-purple-800 uppercase tracking-wider">
                    Population
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-purple-800 uppercase tracking-wider">
                    Website
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-purple-800 uppercase tracking-wider">
                    Schools
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-purple-800 uppercase tracking-wider">
                    Students
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-purple-800 uppercase tracking-wider">
                    Ratio
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-purple-800 uppercase tracking-wider">
                    Locale
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-purple-800 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-purple-800 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-purple-100">
                {paginatedAgencies.length > 0 ? (
                  paginatedAgencies.map((agency) => (
                    <tr key={agency.id} className="hover:bg-purple-50 transition-colors duration-200">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900 max-w-xs truncate" title={agency.name}>
                          {formatValue(agency.name)}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatValue(agency.state)}</div>
                        <div className="text-xs text-gray-500">{formatValue(agency.state_code)}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 max-w-xs truncate">
                          {formatValue(agency.type)}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {formatValue(agency.population)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {agency.website ? (
                          <a 
                            href={agency.website.startsWith('http') ? agency.website : `https://${agency.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-purple-600 hover:text-purple-800 hover:underline truncate max-w-xs block"
                            title={agency.website}
                          >
                            {agency.website.replace('https://', '').replace('http://', '')}
                          </a>
                        ) : (
                          <span className="text-sm text-gray-400">N/A</span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {formatValue(agency.total_schools)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {formatValue(agency.total_students)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {formatValue(agency.student_teacher_ratio)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {formatValue(agency.locale)}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          agency.status === 'Active' 
                            ? 'bg-green-100 text-green-800'
                            : agency.status === 'Inactive'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {formatValue(agency.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <button
                          onClick={() => openAgencyDetails(agency)}
                          className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="11" className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="mt-4 text-lg font-medium">No agencies found</p>
                        <p className="mt-2">Try modifying your search criteria</p>
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
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredAgencies.length)} of {filteredAgencies.length} agencies
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
            href="/contacts"
            className="bg-white border border-purple-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group"
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white transform group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">View Contacts</h3>
                <p className="text-gray-600">Access the contact database</p>
              </div>
            </div>
          </Link>
        </div>
      </main>

      {/* COMPLETE Details Modal */}
      {showModal && selectedAgency && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6 rounded-t-2xl">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{selectedAgency.name}</h2>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-white bg-opacity-20 text-white px-3 py-1 rounded-full text-sm">
                      {formatValue(selectedAgency.type)}
                    </span>
                    <span className="bg-white bg-opacity-20 text-white px-3 py-1 rounded-full text-sm">
                      {formatValue(selectedAgency.state)} {selectedAgency.state_code ? `(${selectedAgency.state_code})` : ''}
                    </span>
                    <span className={`bg-white bg-opacity-20 text-white px-3 py-1 rounded-full text-sm ${
                      selectedAgency.status === 'Active' ? 'bg-green-500 bg-opacity-20' : 
                      selectedAgency.status === 'Inactive' ? 'bg-red-500 bg-opacity-20' : ''
                    }`}>
                      {formatValue(selectedAgency.status)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Grid with ALL information */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Column 1: Main Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b border-purple-200 pb-2">
                    Main Information
                  </h3>
                  
                  <div className="space-y-3">
                    <InfoItem label="Name" value={selectedAgency.name} />
                    <InfoItem label="Type" value={selectedAgency.type} />
                    <InfoItem label="Population" value={selectedAgency.population} isNumber />
                    <InfoItem label="Status" value={selectedAgency.status} />
                  </div>
                </div>

                {/* Column 2: Location */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b border-purple-200 pb-2">
                    Location
                  </h3>
                  
                  <div className="space-y-3">
                    <InfoItem label="State" value={selectedAgency.state} />
                    <InfoItem label="State code" value={selectedAgency.state_code} />
                    <InfoItem label="County" value={selectedAgency.county} />
                    <InfoItem label="Locale" value={selectedAgency.locale} />
                    <InfoItem label="CSA/CBSA area" value={selectedAgency.csa_cbsa} />
                    <InfoItem label="Supervisory union" value={selectedAgency.supervisory_union} />
                  </div>
                </div>

                {/* Column 3: Education */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b border-purple-200 pb-2">
                    Education
                  </h3>
                  
                  <div className="space-y-3">
                    <InfoItem label="Number of schools" value={selectedAgency.total_schools} isNumber />
                    <InfoItem label="Number of students" value={selectedAgency.total_students} isNumber />
                    <InfoItem label="Student/teacher ratio" value={selectedAgency.student_teacher_ratio} />
                    <InfoItem label="Grade level" value={selectedAgency.grade_span} />
                  </div>
                </div>
              </div>

              {/* Second row: Contact and Addresses */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                {/* Contact */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b border-purple-200 pb-2">
                    Contact
                  </h3>
                  
                  <div className="space-y-3">
                    <InfoItem label="Website" value={selectedAgency.website} isLink />
                    <InfoItem label="Domain name" value={selectedAgency.domain_name} />
                    <InfoItem label="Phone" value={selectedAgency.phone} />
                  </div>
                </div>

                {/* Addresses */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b border-purple-200 pb-2">
                    Addresses
                  </h3>
                  
                  <div className="space-y-3">
                    <InfoItem label="Mailing address" value={selectedAgency.mailing_address} />
                    <InfoItem label="Physical address" value={selectedAgency.physical_address} />
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="mt-6 space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-purple-200 pb-2">
                  Metadata
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoItem label="Created at" value={selectedAgency.created_at} isDate />
                  <InfoItem label="Updated at" value={selectedAgency.updated_at} isDate />
                </div>
              </div>

              {/* Close button */}
              <div className="mt-8 flex justify-end">
                <button
                  onClick={closeModal}
                  className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-indigo-700 transition-all duration-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Component to display information consistently
function InfoItem({ label, value, isNumber = false, isLink = false, isDate = false }) {
  const formatValue = () => {
    if (value === null || value === undefined || value === '') return 'N/A';
    
    if (isDate) {
      return new Date(value).toLocaleDateString('en-US');
    }
    
    if (isNumber && typeof value === 'number') {
      return value.toLocaleString();
    }
    
    return value.toString();
  };

  if (isLink && value && value !== 'N/A') {
    return (
      <div>
        <p className="text-sm text-gray-600">{label}</p>
        <a 
          href={value.startsWith('http') ? value : `https://${value}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-purple-600 hover:text-purple-800 hover:underline break-words"
        >
          {value.replace('https://', '').replace('http://', '')}
        </a>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-gray-600">{label}</p>
      <p className="font-semibold text-gray-900 break-words">{formatValue()}</p>
    </div>
  );
}