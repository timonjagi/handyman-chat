import { z } from 'zod';
import { tool } from 'ai';

// List Available Services Tool
export const listServices = tool({
  name: 'listServices',
  description: 'Lists all available services with their variants',
  parameters: z.object({
    category: z.string().optional().describe('Optional category to filter services'),
    location: z.object({
      city: z.string().optional().describe('City name for location-specific services'),
      area: z.string().optional().describe('Specific area within the city')
    }).optional().describe('Location filters for services')
  }),
  execute: async ({ category, location }) => {
    return {
      services: category
        ? mockServices.filter(s => s.category === category)
        : mockServices
    };
  },
});

export const mockServices = [
  {
    id: 'plumbing',
    name: 'Basic Plumbing',
    description: 'Simple repairs and maintenance',
    price: 2000,
    category: 'plumbing'
  },
  {
    id: 'electrical',
    name: 'Electrical',
    description: 'Electrical repairs and installations',
    price: 5000,
    category: 'electrical'
  },
  {
    id: 'cleaning',
    name: 'Cleaning',
    description: 'Regular home cleaning',
    price: 1500,
    category: 'cleaning'
  },
  {
    id: 'carpentry',
    name: 'Carpentry',
    description: 'Furniture repair and custom building',
    price: 3500,
    category: 'carpentry'
  }
];

// Variant Resolution Tool
export const resolveVariant = tool({
  name: 'resolveVariant',
  description: 'Determines service variants based on user requirements',
  parameters: z.object({
    serviceId: z.string().describe('The ID of the identified service'),
    userPreferences: z.object({}).optional().describe('Any user preferences for the service')
  }),
  execute: async ({ serviceId, userPreferences }) => {
    const variants = mockVariantsByService[serviceId as keyof typeof mockVariantsByService] || [];
    const recommendedVariant = variants.length > 0 ? variants[0] : null;

    return { variants, recommendedVariant };
  },
});

export const mockVariantsByService = {
  'plumbing': [
    { id: 'plumbing-basic', name: 'Basic Plumbing', price: 2000, description: 'Simple repairs and maintenance' },
    { id: 'plumbing-advanced', name: 'Advanced Plumbing', price: 5000, description: 'Complex installations and repairs' }
  ],
  'cleaning': [
    { id: 'cleaning-basic', name: 'Basic Cleaning', price: 1500, description: 'Regular home cleaning' },
    { id: 'cleaning-deep', name: 'Deep Cleaning', price: 3500, description: 'Thorough deep cleaning service' }
  ],
  'electrical': [
    { id: 'electrical-basic', name: 'Basic Electrical', price: 2000, description: 'Simple electrical repairs' },
    { id: 'electrical-advanced', name: 'Advanced Electrical', price: 4500, description: 'Complex electrical work' }
  ],
  'carpentry': [
    { id: 'carpentry-repair', name: 'Furniture Repair', price: 1800, description: 'Repair of existing furniture' },
    { id: 'carpentry-custom', name: 'Custom Carpentry', price: 6000, description: 'Custom furniture building' }
  ],
  'painting': [
    { id: 'painting-room', name: 'Room Painting', price: 3000, description: 'Painting for a single room' },
    { id: 'painting-house', name: 'House Painting', price: 15000, description: 'Painting for an entire house' }
  ]
};

// Provider Selection Tool
export const selectProvider = tool({
  name: 'selectProvider',
  description: 'Finds available service providers',
  parameters: z.object({
    serviceId: z.string().describe('The ID of the identified service'),
    variantId: z.string().optional().describe('The ID of the selected service variant'),
    location: z.object({
      area: z.string().optional().describe('The area or neighborhood'),
      city: z.string().optional().describe('The city name')
    }).describe('The location where the service is needed'),
    scheduledTime: z.string().optional().describe('The preferred date and time for the service')
  }),
  execute: async ({ serviceId, variantId, location, scheduledTime }) => {
    // Filter providers by service
    const availableProviders = mockProviders.filter(provider =>
      provider.services.includes(serviceId)
    );

    // Auto-assign the highest rated provider if available
    const autoAssigned = availableProviders.length > 0
      ? availableProviders.sort((a, b) => b.rating - a.rating)[0]
      : null;

    return {
      providers: availableProviders,
      autoAssigned
    };
  },
});

export const mockProviders = [
  {
    id: 'provider1',
    name: 'John Kamau',
    rating: 4.8,
    completedJobs: 156,
    services: ['plumbing', 'electrical'],
    photo: '/placeholder-user.jpg'
  },
  {
    id: 'provider2',
    name: 'Mary Wanjiku',
    rating: 4.9,
    completedJobs: 203,
    services: ['cleaning', 'painting'],
    photo: '/placeholder-user.jpg'
  },
  {
    id: 'provider3',
    name: 'David Omondi',
    rating: 4.7,
    completedJobs: 98,
    services: ['carpentry', 'painting'],
    photo: '/placeholder-user.jpg'
  },
  {
    id: 'provider4',
    name: 'Sarah Njeri',
    rating: 4.6,
    completedJobs: 87,
    services: ['plumbing', 'electrical', 'carpentry'],
    photo: '/placeholder-user.jpg'
  }
];

// Order Creation Tool
export const createOrder = tool({
  name: 'createOrder',
  description: 'Creates a new service order',
  parameters: z.object({
    serviceId: z.string().describe('The ID of the identified service'),
    variantId: z.string().optional().describe('The ID of the selected service variant'),
    providerId: z.string().describe('The ID of the selected provider'),
    location: z.object({
      area: z.string().describe('The area or neighborhood'),
      city: z.string().describe('The city name'),
      details: z.string().optional().describe('Additional location details')
    }).describe('The location where the service is needed'),
    scheduledTime: z.string().describe('The preferred date and time for the service'),
    customerDetails: z.object({
      name: z.string().describe('Customer name'),
      phone: z.string().describe('Customer phone number')
    }).describe('Customer contact information')
  }),
  execute: async (params) => {
    const orderId = `ORD-${Math.floor(Math.random() * 10000)}`;

    const service = mockServices.find(s => s.id === params.serviceId);
    const variant = params.variantId ? mockVariantsByService[params.serviceId as keyof typeof mockVariantsByService]?.find(v => v.id === params.variantId) : undefined;
    const provider = mockProviders.find(p => p.id === params.providerId);

    const amount = variant?.price || (params.variantId?.includes('basic') ? 2000 : 5000); // Use variant price if available, else simplified logic

    return {
      orderId,
      status: 'pending',
      paymentRequired: true,
      amount,
      currency: 'KES',
      service: {
        id: params.serviceId,
        name: service?.name || 'Unknown Service',
        variant: variant ? {
          id: variant.id,
          name: variant.name,
          price: variant.price
        } : undefined
      },
      provider: {
        id: params.providerId,
        name: provider?.name || 'Unknown Provider'
      },
      location: params.location,
      scheduledTime: params.scheduledTime,
      customer: params.customerDetails
    };
  },
});

// Payment Tool
export const processPayment = tool({
  name: 'processPayment',
  description: 'Initiates and tracks payment for an order',
  parameters: z.object({
    orderId: z.string().describe('The ID of the created order'),
    paymentMethod: z.enum(['mpesa', 'card', 'cash']).describe('The payment method to use'),
    phoneNumber: z.string().optional().describe('Phone number for mobile money payments')
  }),
  execute: async ({ orderId, paymentMethod, phoneNumber }) => {
    // Mock implementation - in a real system, this would integrate with payment providers
    const paymentId = `PAY-${Math.floor(Math.random() * 10000)}`;

    // Simulate a successful payment
    return {
      paymentId,
      status: 'completed',
      transactionDetails: {
        method: paymentMethod,
        reference: paymentId,
        timestamp: new Date().toISOString()
      }
    };
  },
});

// Order Lifecycle Tool
export const trackOrderStatus = tool({
  name: 'trackOrderStatus',
  description: 'Tracks and updates order status',
  parameters: z.object({
    orderId: z.string().describe('The ID of the order to track')
  }),
  execute: async ({ orderId }) => {
    // Mock implementation - in a real system, this would query an order management system
    return {
      status: 'confirmed',
      providerDetails: {
        name: 'John Kamau',
        phone: '+254712345678',
        estimatedArrival: '2 hours'
      }
    };
  },
});

// Review & Rebooking Tool
export const handlePostService = tool({
  name: 'handlePostService',
  description: 'Manages reviews and rebooking',
  parameters: z.object({
    orderId: z.string().describe('The ID of the completed order'),
    action: z.enum(['review', 'rebook']).describe('The action to perform'),
    reviewDetails: z.object({
      rating: z.number().min(1).max(5).describe('Rating from 1 to 5'),
      comment: z.string().optional().describe('Review comment')
    }).optional().describe('Review details if action is review')
  }),
  execute: async ({ orderId, action, reviewDetails }) => {
    // Mock implementation - in a real system, this would integrate with review/booking systems
    if (action === 'review') {
      return {
        reviewId: `REV-${Math.floor(Math.random() * 10000)}`,
        status: 'submitted'
      };
    } else {
      return {
        newOrderId: `ORD-${Math.floor(Math.random() * 10000)}`,
        status: 'created'
      };
    }
  },
});

// Legacy tool for backward compatibility
export const getHackathonInfo = tool({
  name: 'getHackathonInfo',
  description: 'Get information about the world\'s shortest hackathon',
  parameters: z.object({}),
  execute: async () => {
    // Mock data
    return { attendees: 1000 };
  },
});


// Available Slots Tool
export const getAvailableSlots = tool({
  name: 'getAvailableSlots',
  description: 'Gets available time slots for service booking',
  parameters: z.object({
    serviceId: z.string().describe('The ID of the selected service'),
    providerId: z.string().optional().describe('The ID of the selected provider'),
    date: z.string().describe('The date to check availability for'),
    location: z.object({
      city: z.string().describe('City name'),
      area: z.string().optional().describe('Specific area within the city')
    }).describe('Location for the service')
  }),
  execute: async ({ serviceId, providerId, date }) => {
    // Mock implementation - in a real system, this would query a scheduling system
    const mockSlots = [
      '09:00 AM',
      '10:00 AM',
      '11:00 AM',
      '02:00 PM',
      '03:00 PM',
      '04:00 PM'
    ];

    return {
      date,
      slots: mockSlots,
      provider: providerId
    };
  },
});

// Request Review Tool
export const requestReview = tool({
  name: 'requestReview',
  description: 'Requests a review for a completed service',
  parameters: z.object({
    orderId: z.string().describe('The ID of the completed order'),
    providerId: z.string().describe('The ID of the service provider'),
    serviceId: z.string().describe('The ID of the service provided')
  }),
  execute: async ({ orderId, providerId, serviceId }) => {
    // Mock implementation - in a real system, this would check if the order is completed
    return {
      canReview: true,
      orderDetails: {
        orderId,
        providerId,
        serviceId,
        completionDate: new Date().toISOString()
      }
    };
  },
});

// Collect User Details Tool
export const collectUserDetails = tool({
  name: 'collectUserDetails',
  description: 'Collects and validates user details for service booking',
  parameters: z.object({
    orderId: z.string().optional().describe('The ID of the order if updating existing details'),
    details: z.object({
      name: z.string().describe('Customer name'),
      phone: z.string().describe('Customer phone number'),
      address: z.string().describe('Customer address'),
      area: z.string().describe('Area or neighborhood'),
      city: z.string().describe('City name')
    }).describe('Customer details')
  }),
  execute: async ({ orderId, details }) => {
    // Mock implementation - in a real system, this would validate and store customer details
    return {
      status: 'success',
      customerId: `CUST-${Math.floor(Math.random() * 10000)}`,
      details
    };
  },
});

// Order Cancellation Tool
export const cancelOrder = tool({
  name: 'cancelOrder',
  description: 'Cancels an existing order',
  parameters: z.object({
    orderId: z.string().describe('The ID of the order to cancel'),
    reason: z.string().describe('Reason for cancellation'),
    refundRequired: z.boolean().describe('Whether a refund is required')
  }),
  execute: async ({ orderId, reason, refundRequired }) => {
    // Mock implementation - in a real system, this would handle order cancellation and refunds
    return {
      status: 'cancelled',
      cancellationId: `CANC-${Math.floor(Math.random() * 10000)}`,
      refundStatus: refundRequired ? 'initiated' : 'not_required'
    };
  },
});

// Order Rescheduling Tool
export const rescheduleOrder = tool({
  name: 'rescheduleOrder',
  description: 'Reschedules an existing order',
  parameters: z.object({
    orderId: z.string().describe('The ID of the order to reschedule'),
    newDateTime: z.string().describe('New date and time for the service'),
    reason: z.string().optional().describe('Reason for rescheduling')
  }),
  execute: async ({ orderId, newDateTime, reason }) => {
    // Mock implementation - in a real system, this would check availability and update scheduling
    return {
      status: 'rescheduled',
      newSchedule: {
        dateTime: newDateTime,
        confirmed: true
      }
    };
  },
});

// Update the bingwaTools export
export const bingwaTools = {
  resolveVariant,
  selectProvider,
  createOrder,
  rescheduleOrder,
  cancelOrder,
  collectUserDetails,
  processPayment,
  trackOrderStatus,
  handlePostService,
  getHackathonInfo,
  listServices,        // Add new tool
  getAvailableSlots,   // Add new tool
  requestReview        // Add new tool
};
