// ==========================================
// User & Auth Types
// ==========================================

export interface User {
  _id: string
  name: string
  email: string
  phoneNumber?: string
  address?: string
  role: "CLIENT" | "SERVICE_PROVIDER" | "AGENT"
  createdAt: string
  profileImage?: string
  avatar?: string
  isVerified?: boolean
  location?: GeoLocation
  organization?: {
    _id: string
    name: string
  }
  serviceProvider?: {
    _id: string
    name: string
  }
}

// ==========================================
// Location Types
// ==========================================

export interface GeoLocation {
  type: string
  coordinates: [number, number] // [longitude, latitude]
}

export interface Address {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

// ==========================================
// Client Types
// ==========================================

export interface Client {
  _id: string
  name: string
  email: string
  phoneNumber?: string
}

// ==========================================
// Service Provider Types
// ==========================================

export interface ServiceProviderBasic {
  _id: string
  name?: string
  companyName?: string
  email: string
  phone?: string
}

export interface ServiceProviderDetail {
  _id: string
  companyName: string
  contactPerson: string
  email: string
  phone: string
  rating: number
  totalReviews: number
  description: string
}

export interface ServiceProvider {
  _id: string
  name: string
  email: string
  phone?: string
  address?: string
  rating?: number
  serviceCompany?: {
    _id: string
    name: string
    categories: string[]
    description?: string
    images?: string[]
    logo?: string
  }
}

// ==========================================
// Agent Types
// ==========================================

export interface Agent {
  _id: string
  name: string
  email: string
  phoneNumber?: string
}

// ==========================================
// Organization Types
// ==========================================

export interface Organization {
  _id: string
  name: string
  description?: string
  phone?: string
}

// ==========================================
// Service Types
// ==========================================

export interface ServiceAvailability {
  day: string
  startTime: string
  endTime: string
}

export interface AdditionalTask {
  _id?: string
  description: string
  extraPrice: number
  timeAdded?: string
}

export interface ServiceRatings {
  average: number
  count: number
}

export interface ServiceFeature {
  icon?: string
  title: string
  description?: string
}

export interface ServiceFAQ {
  question: string
  answer: string
}

export interface ServicePricingTier {
  name: string
  price: number
  duration: string
  description?: string
  isPopular?: boolean
}

export interface ServiceAddress {
  street?: string
  city?: string
  state?: string
  zipCode?: string
  country?: string
  landmark?: string
}

export interface ServiceArea {
  radius: number
  cities?: string[]
}

export interface SocialLinks {
  website?: string
  facebook?: string
  instagram?: string
  youtube?: string
}

export interface ServiceBasic {
  _id: string
  name: string
  description?: string
}

export interface Service {
  _id: string
  name: string
  description: string
  shortDescription?: string
  category: string
  subCategory?: string
  basePrice: number
  estimatedDuration: string
  serviceProvider: {
    _id: string
    name: string
    email: string
  }
  organization: Organization
  availability: ServiceAvailability[]
  location: GeoLocation
  address?: ServiceAddress
  rating?: number
  reviewCount?: number
  tags?: string[]
  images?: string[]
  coverImage?: string
  isFeatured?: boolean
  completedBookings?: number
}

export interface ServiceDetail {
  _id: string
  name: string
  description: string
  shortDescription?: string
  category: string
  subCategory?: string
  basePrice: number
  estimatedDuration: string
  serviceProvider?: ServiceProviderDetail
  organization?: Organization
  availability?: ServiceAvailability[]
  location?: GeoLocation
  address?: ServiceAddress
  additionalTasks?: AdditionalTask[]
  ratings?: ServiceRatings
  images?: string[]
  coverImage?: string
  videoUrl?: string
  tags?: string[]
  finalPrice?: number
  isFeatured?: boolean
  isActive?: boolean
  
  // Enhanced Fields
  features?: ServiceFeature[]
  faqs?: ServiceFAQ[]
  pricingTiers?: ServicePricingTier[]
  requirements?: string[]
  cancellationPolicy?: string
  warrantyInfo?: string
  serviceArea?: ServiceArea
  minBookingNotice?: number
  maxBookingsPerDay?: number
  completedBookings?: number
  viewCount?: number
  contactPhone?: string
  contactEmail?: string
  socialLinks?: SocialLinks
  assignedAgents?: Array<{
    _id: string
    name: string
    profileImage?: string
  }>
  
  createdAt: string
  updatedAt: string
}

// ==========================================
// Booking Types
// ==========================================

export interface ExtraTask {
  _id?: string
  description: string
  extraPrice: number
}

export type BookingStatus = "PENDING" | "CONFIRMED" | "ASSIGNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
export type PaymentStatus = "Paid" | "Unpaid"

// Simplified Booking type for dashboard lists
export interface Booking {
  _id: string
  client: string
  service: string
  bookingDate: string
  location?: GeoLocation
  address?: string
  status: BookingStatus
}

// Detailed booking type for booking dialog/details view
export interface BookingDetails {
  _id: string
  totalPrice?: number
  method ?: string
  client: Client
  serviceProvider: ServiceProviderBasic
  service: ServiceBasic
  bookingDate: string
  bookingTime: string
  status: BookingStatus
  paymentStatus: PaymentStatus
  location?: GeoLocation
  address?: string
  extraTasks?: ExtraTask[]
  createdAt: string
  updatedAt: string
  agent?: Agent
}

export interface RecentBooking {
  _id: string
  service: {
    _id: string
    name: string
    description?: string
  }
  serviceProvider: {
    _id: string
    name: string
    email: string
  }
  bookingDate: string
  bookingTime: string
  status: string
  totalPrice?: number
  paymentStatus?: string
  extraTasks?: ExtraTask[]
}

// ==========================================
// Review Types
// ==========================================

export interface Review {
  _id: string
  rating: number
  comment: string
  customer: {
    name: string
  }
  createdAt: string
}

export interface RecentReview {
  _id: string
  rating: number
  comment: string
  serviceProvider: {
    companyName: string
  }
  createdAt: string
}

// ==========================================
// Dashboard Types
// ==========================================

export interface DashboardStats {
  total: number
  pending: number
  inProgress: number
  completed: number
}

export interface DashboardBookings {
  pending: Booking[]
  inProgress: Booking[]
  completed: Booking[]
}

// ==========================================
// Component Props Types
// ==========================================

export interface MapViewProps {
  latitude: number
  longitude: number
  address?: string
  height?: string
  zoom?: number
}

export interface BookingDialogProps {
  bookingId: string | null
  onClose: () => void
}
