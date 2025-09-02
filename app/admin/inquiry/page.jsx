'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FiTrash2, FiLoader, FiMail, FiSearch, FiAlertTriangle, FiUser, FiPhone, FiAlertCircle, FiEye, FiMoreHorizontal } from 'react-icons/fi'
import { useInquiries, useDeleteInquiry } from '@/hooks/useInquiry'
import InfiniteScroll from 'react-infinite-scroll-component'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Custom hook to detect desktop vs mobile
const useIsDesktop = () => {
    const [isDesktop, setIsDesktop] = useState(false)

    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 1024) // lg breakpoint
        }
        
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return isDesktop
}

export default function InquiryListPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [deleteId, setDeleteId] = useState(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const [deleteError, setDeleteError] = useState('')
    const [expandedRows, setExpandedRows] = useState(new Set())
    const router = useRouter()
    const isDesktop = useIsDesktop()

    const { data: inquiriesData, isLoading, error, refetch } = useInquiries()
    const deleteMutation = useDeleteInquiry()

    const inquiries = inquiriesData?.data || []

    // Handle card click to navigate to detail page (only on desktop)
    const handleCardClick = (inquiryId) => {
        if (isDesktop) {
            router.push(`/admin/inquiry/${inquiryId}`)
        }
    }

    const handleDeleteClick = (inquiry, e) => {
        e.stopPropagation()
        setDeleteId(inquiry._id)
        setDeleteError('')
        setIsDialogOpen(true)
    }

    const toggleRowExpansion = (inquiryId) => {
        const newExpanded = new Set(expandedRows)
        if (newExpanded.has(inquiryId)) {
            newExpanded.delete(inquiryId)
        } else {
            newExpanded.add(inquiryId)
        }
        setExpandedRows(newExpanded)
    }

    // Delete confirmation handler with proper 404 handling
    const handleConfirmDelete = async () => {
        if (!deleteId) return

        const deletingId = deleteId

        try {
            setDeleteError('')
            setIsDialogOpen(false)
            setDeleteId(null)

            await deleteMutation.mutateAsync(deletingId)

            const currentPath = window.location.pathname
            if (currentPath === `/admin/inquiry/${deletingId}`) {
                router.push('/admin/inquiry')
            }

            console.log('Inquiry deleted successfully')

        } catch (error) {
            console.error('Failed to delete inquiry:', error)

            const errorMessage = error.response?.data?.error || error.message || 'Unknown error occurred'
            const status = error.response?.status

            let userFriendlyMessage = ''

            switch (status) {
                case 404:
                    userFriendlyMessage = 'This inquiry no longer exists. It may have already been deleted.'
                    refetch()
                    break
                case 403:
                    userFriendlyMessage = 'You do not have permission to delete this inquiry.'
                    break
                case 500:
                    userFriendlyMessage = 'Server error occurred while deleting the inquiry. Please try again.'
                    break
                default:
                    userFriendlyMessage = `Failed to delete inquiry: ${errorMessage}`
            }

            setDeleteError(userFriendlyMessage)
            setDeleteId(deletingId)
            setIsDialogOpen(true)
        }
    }

    const fetchMoreData = () => {
        setTimeout(() => {
            setHasMore(false)
        }, 1500)
    }

    const filteredInquiries = inquiries.filter(inquiry =>
        inquiry.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const selectedInquiry = inquiries.find(inq => inq._id === deleteId)

    const truncateText = (text, maxLength) => {
        if (!text) return 'N/A'
        return text.length > maxLength ? text.slice(0, maxLength) + '...' : text
    }

    // Loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <FiLoader className="animate-spin h-8 w-8 text-red-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading inquiries...</p>
                </div>
            </div>
        )
    }

    // Error state with proper error handling
    if (error) {
        const errorMessage = error.response?.data?.error || error.message || 'Unknown error occurred'
        const status = error.response?.status

        let displayMessage = ''
        let showRetry = true

        switch (status) {
            case 404:
                displayMessage = 'Inquiries endpoint not found. Please contact system administrator.'
                showRetry = false
                break
            case 403:
                displayMessage = 'You do not have permission to view inquiries.'
                showRetry = false
                break
            case 500:
                displayMessage = 'Server error occurred while loading inquiries.'
                break
            default:
                displayMessage = `Error loading inquiries: ${errorMessage}`
        }

        return (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <FiAlertCircle className="w-8 h-8 text-red-600 mx-auto mb-4" />
                <p className="text-red-600 mb-4">{displayMessage}</p>
                {showRetry && (
                    <button
                        onClick={() => refetch()}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Try Again
                    </button>
                )}
            </div>
        )
    }

    return (
        <div className="container mx-auto px-0 max-w-full">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Inquiries</h1>
                        <p className="text-gray-600 mt-2">
                            Manage customer inquiries ({inquiries.length} total)
                        </p>
                    </div>
                </div>

                {/* Search */}
                <div className="bg-white rounded-xl shadow-sm border border-red-100 p-4">
                    <div className="relative max-w-md">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search inquiries..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        />
                    </div>
                </div>

                {filteredInquiries.length > 0 ? (
                    <>
                        {/* Desktop Table View */}
                        <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-red-100 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                                                Name
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                                                Email
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">
                                                Phone
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                                                Subject
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                                                Description
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredInquiries.map((inquiry) => (
                                            <tr key={inquiry._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="min-w-0">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {inquiry.fullname && inquiry.fullname.length > 20 ? (
                                                                    <div>
                                                                        <span>{expandedRows.has(inquiry._id) ? inquiry.fullname : truncateText(inquiry.fullname, 20)}</span>
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation()
                                                                                toggleRowExpansion(inquiry._id)
                                                                            }}
                                                                            className="ml-1 text-blue-600 hover:text-blue-800 text-xs"
                                                                        >
                                                                            {expandedRows.has(inquiry._id) ? 'Less' : 'More'}
                                                                        </button>
                                                                    </div>
                                                                ) : (
                                                                    inquiry.fullname || 'Unknown'
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900 truncate max-w-[150px]" title={inquiry.email}>
                                                        {inquiry.email || 'No email'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {inquiry.phonenumber || 'No phone'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900">
                                                        {inquiry.subject && inquiry.subject.length > 30 ? (
                                                            <div>
                                                                <span>{expandedRows.has(inquiry._id) ? inquiry.subject : truncateText(inquiry.subject, 30)}</span>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation()
                                                                        toggleRowExpansion(inquiry._id)
                                                                    }}
                                                                    className="ml-1 text-blue-600 hover:text-blue-800 text-xs"
                                                                >
                                                                    {expandedRows.has(inquiry._id) ? 'Less' : 'More'}
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            inquiry.subject || 'No subject'
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-2 py-4">
                                                    <div className="text-sm text-gray-600">
                                                        {inquiry.description && inquiry.description.length > 50 ? (
                                                            <div>
                                                                <span>{expandedRows.has(inquiry._id) ? inquiry.description : truncateText(inquiry.description, 50)}</span>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation()
                                                                        toggleRowExpansion(inquiry._id)
                                                                    }}
                                                                    className="ml-1 text-blue-600 hover:text-blue-800 text-xs"
                                                                >
                                                                    {expandedRows.has(inquiry._id) ? 'Less' : 'More'}
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            inquiry.description || 'No description'
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex items-center space-x-2">
                                                        <button
                                                            onClick={(e) => handleDeleteClick(inquiry, e)}
                                                            disabled={deleteMutation.isPending}
                                                            className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                                                            title="Delete Inquiry"
                                                        >
                                                            {deleteMutation.isPending && deleteId === inquiry._id ? (
                                                                <FiLoader className="w-4 h-4 animate-spin" />
                                                            ) : (
                                                                <FiTrash2 className="w-4 h-4" />
                                                            )}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Mobile Card View - NO ONCLICK */}
                        <div className="lg:hidden">
                            <InfiniteScroll
                                dataLength={filteredInquiries.length}
                                next={fetchMoreData}
                                hasMore={hasMore}
                                loader={
                                    <div className="flex items-center justify-center py-8">
                                        <div className="text-center">
                                            <FiLoader className="animate-spin h-6 w-6 text-red-600 mx-auto mb-2" />
                                            <p className="text-gray-600 text-sm">Loading more inquiries...</p>
                                        </div>
                                    </div>
                                }
                                scrollThreshold={0.8}
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {filteredInquiries.map((inquiry) => (
                                        <div
                                            key={inquiry._id}
                                            // Removed onClick for mobile - no navigation
                                            className="bg-white rounded-xl shadow-sm border border-red-100 overflow-hidden transition-all duration-200 min-h-[280px] flex flex-col"
                                        >
                                            <div className="p-4 flex flex-col flex-grow">
                                                {/* Header with user info */}
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex items-center space-x-3 flex-grow">
                                                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                            <FiUser className="w-5 h-5 text-red-600" />
                                                        </div>
                                                        <div className="min-w-0 flex-grow">
                                                            <h3 className="text-base font-semibold text-gray-900 truncate">
                                                                {inquiry.fullname || 'Unknown'}
                                                            </h3>
                                                            <p className="text-sm text-gray-500 truncate">
                                                                {inquiry.email || 'No email'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Subject */}
                                                <div className="mb-2">
                                                    <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                                                        {inquiry.subject || 'No subject'}
                                                    </h4>
                                                </div>

                                                {/* Description - grows to fill available space */}
                                                <div className="flex-grow mb-3">
                                                    <p className="text-gray-600 text-sm line-clamp-3">
                                                        {inquiry.description || 'No description provided'}
                                                    </p>
                                                </div>

                                                {/* Phone Number */}
                                                <div className="flex items-center mb-3">
                                                    <FiPhone className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                                                    <span className="text-sm text-gray-600 truncate">
                                                        {inquiry.phonenumber || 'No phone number'}
                                                    </span>
                                                </div>

                                                {/* Footer with buttons - always at bottom */}
                                                <div className="pt-3 border-t border-gray-100 mt-auto">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs text-gray-500">
                                                            {inquiry.createdAt 
                                                                ? new Date(inquiry.createdAt).toLocaleDateString()
                                                                : 'Unknown date'
                                                            }
                                                        </span>
                                                        
                                                        <button
                                                            onClick={(e) => handleDeleteClick(inquiry, e)}
                                                            disabled={deleteMutation.isPending}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center"
                                                            title="Delete Inquiry"
                                                        >
                                                            {deleteMutation.isPending && deleteId === inquiry._id ? (
                                                                <FiLoader className="w-4 h-4 animate-spin" />
                                                            ) : (
                                                                <FiTrash2 className="w-4 h-4" />
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </InfiniteScroll>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-12">
                        <FiMail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No inquiries found</h3>
                        <p className="text-gray-600 mb-6">
                            {searchTerm ? `No inquiries match "${searchTerm}"` : 'No customer inquiries yet.'}
                        </p>
                    </div>
                )}

                {/* Delete Confirmation AlertDialog with Error Handling */}
                <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center space-x-2">
                                <FiAlertTriangle className="w-5 h-5 text-red-500" />
                                <span>{deleteError ? 'Delete Error' : 'Delete Inquiry'}</span>
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                {deleteError ? (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-2">
                                        <div className="flex items-center">
                                            <FiAlertCircle className="w-4 h-4 text-red-600 mr-2 flex-shrink-0" />
                                            <p className="text-red-800 text-sm">{deleteError}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        Are you sure you want to delete the inquiry from "<strong>{selectedInquiry?.fullname}</strong>"?
                                        This action cannot be undone and will permanently remove this inquiry from your system.
                                    </>
                                )}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel
                                onClick={() => {
                                    setDeleteError('')
                                    setDeleteId(null)
                                }}
                            >
                                {deleteError ? 'Close' : 'Cancel'}
                            </AlertDialogCancel>
                            {!deleteError && (
                                <AlertDialogAction
                                    onClick={handleConfirmDelete}
                                    className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
                                    disabled={deleteMutation.isPending}
                                >
                                    {deleteMutation.isPending ? (
                                        <>
                                            <FiLoader className="w-4 h-4 mr-2 animate-spin" />
                                            Deleting...
                                        </>
                                    ) : (
                                        <>
                                            <FiTrash2 className="w-4 h-4 mr-2" />
                                            Delete Inquiry
                                        </>
                                    )}
                                </AlertDialogAction>
                            )}
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    )
}
