import { z } from 'zod';
import { tool } from 'ai';

// Service Identification Tool
export const identifyService = tool({
  name: 'identifyService',
  description: 'Identifies the requested service from user input',
  parameters: z.object({
    userRequest: z.string().describe('The user\'s request in natural language')
  }),
  execute: async ({ userRequest }) => {
    // Mock implementation - in a real system, this would query a service database
    const services = [
      { id: 'plumbing', name: 'Plumbing', description: 'Plumbing services including repairs, installations, and maintenance' },
      { id: 'cleaning', name: 'Cleaning', description: 'Home and office cleaning services' },
      { id: 'electrical', name: 'Electrical', description: 'Electrical repairs and installations' },
      { id: 'carpentry', name: 'Carpentry', description: 'Furniture repairs, installations, and custom builds' },
      { id: 'painting', name: 'Painting', description: 'Interior and exterior painting services' }
    ];
    
    // Simple keyword matching for demo purposes
    const userRequestLower = userRequest.toLowerCase();
    const matchedService = services.find(service => 
      userRequestLower.includes(service.id) || 
      userRequestLower.includes(service.name.toLowerCase())
    );
    
    return matchedService || { 
      id: 'unknown', 
      name: 'Unknown Service', 
      description: 'Could not identify a specific service from your request' 
    };
  },
});

// Variant Resolution Tool
export const resolveVariant = tool({
  name: 'resolveVariant',
  description: 'Determines service variants based on user requirements',
  parameters: z.object({
    serviceId: z.string().describe('The ID of the identified service'),
    userPreferences: z.object({}).optional().describe('Any user preferences for the service')
  }),
  execute: async ({ serviceId, userPreferences }) => {
    // Mock implementation - in a real system, this would query a variants database
    const variantsByService = {
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
    
    const variants = variantsByService[serviceId as keyof typeof variantsByService] || [];
    const recommendedVariant = variants.length > 0 ? variants[0] : null;
    
    return { variants, recommendedVariant };
  },
});

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
    // Mock implementation - in a real system, this would query a provider database
    const mockProviders = [
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
    // Mock implementation - in a real system, this would call an order creation API
    const orderId = `ORD-${Math.floor(Math.random() * 10000)}`;
    
    return { 
      orderId, 
      status: 'pending', 
      paymentRequired: true,
      amount: params.variantId?.includes('basic') ? 2000 : 5000, // Simplified pricing logic
      currency: 'KES'
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

// Export all tools
export const bingwaTools = {
  identifyService,
  resolveVariant,
  selectProvider,
  createOrder,
  processPayment,
  trackOrderStatus,
  handlePostService,
  getHackathonInfo
};
