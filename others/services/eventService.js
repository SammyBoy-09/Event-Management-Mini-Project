import apiService, { API_ENDPOINTS } from './apiService';
import { mockEvents } from '../data/mockData';

class EventService {
  // Get all events
  async getAllEvents(filters = {}) {
    try {
      // TODO: Replace with actual API call
      // const response = await apiService.get(API_ENDPOINTS.EVENTS.GET_ALL);

      // Mock implementation with basic filtering
      let events = [...mockEvents];

      if (filters.category) {
        events = events.filter(event => event.category === filters.category);
      }

      if (filters.status) {
        events = events.filter(event => event.status === filters.status);
      }

      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        events = events.filter(event =>
          event.title.toLowerCase().includes(searchLower) ||
          event.description.toLowerCase().includes(searchLower) ||
          event.organizer.toLowerCase().includes(searchLower)
        );
      }

      if (filters.date) {
        events = events.filter(event => event.date === filters.date);
      }

      return { events, total: events.length };
    } catch (error) {
      console.error('Get events error:', error);
      throw error;
    }
  }

  // Get event by ID
  async getEventById(eventId) {
    try {
      // TODO: Replace with actual API call
      // const response = await apiService.get(API_ENDPOINTS.EVENTS.GET_BY_ID(eventId));

      // Mock implementation
      const event = mockEvents.find(e => e.id === eventId);
      if (!event) {
        throw new Error('Event not found');
      }

      return event;
    } catch (error) {
      console.error('Get event error:', error);
      throw error;
    }
  }

  // Create new event
  async createEvent(eventData) {
    try {
      // TODO: Replace with actual API call
      // const response = await apiService.post(API_ENDPOINTS.EVENTS.CREATE, eventData);

      // Mock implementation
      const newEvent = {
        id: Date.now().toString(),
        ...eventData,
        currentAttendees: 0,
        status: eventData.isPublic ? 'pending' : 'approved',
        createdAt: new Date().toISOString(),
        image: eventData.image || `https://via.placeholder.com/400x200/2563EB/FFFFFF?text=${eventData.title}`,
      };

      return newEvent;
    } catch (error) {
      console.error('Create event error:', error);
      throw error;
    }
  }

  // Update event
  async updateEvent(eventId, eventData) {
    try {
      // TODO: Replace with actual API call
      // const response = await apiService.put(API_ENDPOINTS.EVENTS.UPDATE(eventId), eventData);

      // Mock implementation
      const updatedEvent = {
        ...eventData,
        id: eventId,
        updatedAt: new Date().toISOString(),
      };

      return updatedEvent;
    } catch (error) {
      console.error('Update event error:', error);
      throw error;
    }
  }

  // Delete event
  async deleteEvent(eventId) {
    try {
      // TODO: Replace with actual API call
      // await apiService.delete(API_ENDPOINTS.EVENTS.DELETE(eventId));

      // Mock implementation
      return { success: true, message: 'Event deleted successfully' };
    } catch (error) {
      console.error('Delete event error:', error);
      throw error;
    }
  }

  // RSVP to event
  async rsvpEvent(eventId) {
    try {
      // TODO: Replace with actual API call
      // const response = await apiService.post(API_ENDPOINTS.EVENTS.RSVP(eventId));

      // Mock implementation
      return {
        success: true,
        message: 'RSVP confirmed successfully',
        eventId,
      };
    } catch (error) {
      console.error('RSVP error:', error);
      throw error;
    }
  }

  // Cancel RSVP
  async cancelRsvp(eventId) {
    try {
      // TODO: Replace with actual API call
      // const response = await apiService.post(API_ENDPOINTS.EVENTS.CANCEL_RSVP(eventId));

      // Mock implementation
      return {
        success: true,
        message: 'RSVP cancelled successfully',
        eventId,
      };
    } catch (error) {
      console.error('Cancel RSVP error:', error);
      throw error;
    }
  }

  // Approve event (Admin only)
  async approveEvent(eventId) {
    try {
      // TODO: Replace with actual API call
      // const response = await apiService.patch(API_ENDPOINTS.EVENTS.APPROVE(eventId));

      // Mock implementation
      return {
        success: true,
        message: 'Event approved successfully',
        eventId,
        status: 'approved',
      };
    } catch (error) {
      console.error('Approve event error:', error);
      throw error;
    }
  }

  // Reject event (Admin only)
  async rejectEvent(eventId, reason = '') {
    try {
      // TODO: Replace with actual API call
      // const response = await apiService.patch(API_ENDPOINTS.EVENTS.REJECT(eventId), { reason });

      // Mock implementation
      return {
        success: true,
        message: 'Event rejected',
        eventId,
        status: 'rejected',
        reason,
      };
    } catch (error) {
      console.error('Reject event error:', error);
      throw error;
    }
  }

  // Get user's events
  async getUserEvents(userId) {
    try {
      // TODO: Replace with actual API call
      // const response = await apiService.get(API_ENDPOINTS.USERS.GET_EVENTS);

      // Mock implementation
      const userEvents = mockEvents.filter(event => event.createdBy === userId);
      return userEvents;
    } catch (error) {
      console.error('Get user events error:', error);
      throw error;
    }
  }

  // Upload event image
  async uploadEventImage(imageFile) {
    try {
      // TODO: Replace with actual API call
      // const response = await apiService.uploadFile(API_ENDPOINTS.UPLOAD.IMAGE, imageFile);

      // Mock implementation
      return {
        url: `https://via.placeholder.com/400x200/2563EB/FFFFFF?text=Event+Image`,
        filename: 'mock_image.jpg',
      };
    } catch (error) {
      console.error('Upload image error:', error);
      throw error;
    }
  }
}

export const eventService = new EventService();
export default eventService;
