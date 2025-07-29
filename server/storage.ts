import { type TrackingNumber, type InsertTrackingNumber, type TrackingEvent, type InsertTrackingEvent, type TrackingWithEvents } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Tracking Numbers
  getTrackingNumber(trackingNumber: string): Promise<TrackingWithEvents | undefined>;
  getAllTrackingNumbers(): Promise<TrackingNumber[]>;
  createTrackingNumber(data: InsertTrackingNumber): Promise<TrackingNumber>;
  updateTrackingNumber(id: string, data: Partial<InsertTrackingNumber>): Promise<TrackingNumber | undefined>;
  deleteTrackingNumber(id: string): Promise<boolean>;
  
  // Tracking Events
  getTrackingEvents(trackingNumberId: string): Promise<TrackingEvent[]>;
  addTrackingEvent(data: InsertTrackingEvent): Promise<TrackingEvent>;
  updateTrackingEvent(id: string, data: Partial<InsertTrackingEvent>): Promise<TrackingEvent | undefined>;
  deleteTrackingEvent(id: string): Promise<boolean>;
  
  // Statistics
  getTrackingStats(): Promise<{
    totalPackages: number;
    inTransit: number;
    delivered: number;
    thisMonth: number;
  }>;
}

export class MemStorage implements IStorage {
  private trackingNumbers: Map<string, TrackingNumber>;
  private trackingEvents: Map<string, TrackingEvent>;

  constructor() {
    this.trackingNumbers = new Map();
    this.trackingEvents = new Map();
    this.seedData();
  }

  private seedData() {
    // Create some initial tracking numbers for demo
    const sampleTracking: TrackingNumber[] = [
      {
        id: "1",
        trackingNumber: "MTK123456789",
        customerName: "John Smith",
        deliveryAddress: "123 Oak Street\nTampa, FL 33601",
        packageWeight: "15.2 lbs",
        serviceType: "Standard Ground",
        referenceNumber: "Order #12345",
        estimatedDelivery: "March 25, 2024",
        currentStatus: "In Transit",
        currentLocation: "Tampa, FL Local Depot",
        createdAt: new Date("2024-03-22"),
        updatedAt: new Date("2024-03-24"),
      },
      {
        id: "2",
        trackingNumber: "MTK987654321",
        customerName: "Sarah Johnson",
        deliveryAddress: "456 Palm Ave\nMiami, FL 33101",
        packageWeight: "22.8 lbs",
        serviceType: "Express",
        referenceNumber: "Order #12346",
        estimatedDelivery: "March 24, 2024",
        currentStatus: "Out for Delivery",
        currentLocation: "Miami, FL",
        createdAt: new Date("2024-03-21"),
        updatedAt: new Date("2024-03-24"),
      },
      {
        id: "3",
        trackingNumber: "MTK456789123",
        customerName: "Mike Davis",
        deliveryAddress: "789 Sunset Blvd\nOrlando, FL 32801",
        packageWeight: "18.5 lbs",
        serviceType: "Standard Ground",
        referenceNumber: "Order #12347",
        estimatedDelivery: "March 22, 2024",
        currentStatus: "Delivered",
        currentLocation: "Orlando, FL",
        createdAt: new Date("2024-03-20"),
        updatedAt: new Date("2024-03-22"),
      }
    ];

    sampleTracking.forEach(tracking => {
      this.trackingNumbers.set(tracking.id, tracking);
    });

    // Add sample events
    const sampleEvents: TrackingEvent[] = [
      {
        id: "e1",
        trackingNumberId: "1",
        status: "Package received at facility",
        location: "Miami, FL Distribution Center",
        description: "Your package has been received and is being processed",
        timestamp: "March 22, 2024 - 2:30 PM",
        createdAt: new Date("2024-03-22T14:30:00"),
      },
      {
        id: "e2",
        trackingNumberId: "1",
        status: "In transit to destination",
        location: "Orlando, FL Sorting Facility",
        description: "Package is on its way to the destination city",
        timestamp: "March 23, 2024 - 8:15 AM",
        createdAt: new Date("2024-03-23T08:15:00"),
      },
      {
        id: "e3",
        trackingNumberId: "1",
        status: "Arrived at local facility",
        location: "Tampa, FL Local Depot",
        description: "Package has arrived at the local delivery facility",
        timestamp: "March 24, 2024 - 6:45 AM",
        createdAt: new Date("2024-03-24T06:45:00"),
      }
    ];

    sampleEvents.forEach(event => {
      this.trackingEvents.set(event.id, event);
    });
  }

  private generateTrackingNumber(): string {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `MTK${timestamp}${random}`;
  }

  async getTrackingNumber(trackingNumber: string): Promise<TrackingWithEvents | undefined> {
    const tracking = Array.from(this.trackingNumbers.values()).find(
      t => t.trackingNumber === trackingNumber
    );
    
    if (!tracking) return undefined;

    const events = Array.from(this.trackingEvents.values())
      .filter(e => e.trackingNumberId === tracking.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return { ...tracking, events };
  }

  async getAllTrackingNumbers(): Promise<TrackingNumber[]> {
    return Array.from(this.trackingNumbers.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createTrackingNumber(data: InsertTrackingNumber): Promise<TrackingNumber> {
    const id = randomUUID();
    const trackingNumber = this.generateTrackingNumber();
    const now = new Date();
    
    const newTracking: TrackingNumber = {
      id,
      trackingNumber,
      ...data,
      createdAt: now,
      updatedAt: now,
    };

    this.trackingNumbers.set(id, newTracking);

    // Create initial tracking event
    const initialEvent: TrackingEvent = {
      id: randomUUID(),
      trackingNumberId: id,
      status: data.currentStatus,
      location: data.currentLocation,
      description: `Package has been ${data.currentStatus.toLowerCase()}`,
      timestamp: now.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true 
      }),
      createdAt: now,
    };

    this.trackingEvents.set(initialEvent.id, initialEvent);

    return newTracking;
  }

  async updateTrackingNumber(id: string, data: Partial<InsertTrackingNumber>): Promise<TrackingNumber | undefined> {
    const existing = this.trackingNumbers.get(id);
    if (!existing) return undefined;

    const updated: TrackingNumber = {
      ...existing,
      ...data,
      updatedAt: new Date(),
    };

    this.trackingNumbers.set(id, updated);
    return updated;
  }

  async deleteTrackingNumber(id: string): Promise<boolean> {
    // Delete associated events first
    const events = Array.from(this.trackingEvents.values())
      .filter(e => e.trackingNumberId === id);
    
    events.forEach(event => {
      this.trackingEvents.delete(event.id);
    });

    return this.trackingNumbers.delete(id);
  }

  async getTrackingEvents(trackingNumberId: string): Promise<TrackingEvent[]> {
    return Array.from(this.trackingEvents.values())
      .filter(e => e.trackingNumberId === trackingNumberId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async addTrackingEvent(data: InsertTrackingEvent): Promise<TrackingEvent> {
    const id = randomUUID();
    const event: TrackingEvent = {
      id,
      ...data,
      createdAt: new Date(),
    };

    this.trackingEvents.set(id, event);

    // Update the tracking number's current status
    const tracking = this.trackingNumbers.get(data.trackingNumberId);
    if (tracking) {
      tracking.currentStatus = data.status;
      tracking.currentLocation = data.location;
      tracking.updatedAt = new Date();
      this.trackingNumbers.set(tracking.id, tracking);
    }

    return event;
  }

  async updateTrackingEvent(id: string, data: Partial<InsertTrackingEvent>): Promise<TrackingEvent | undefined> {
    const existing = this.trackingEvents.get(id);
    if (!existing) return undefined;

    const updated: TrackingEvent = {
      ...existing,
      ...data,
    };

    this.trackingEvents.set(id, updated);
    return updated;
  }

  async deleteTrackingEvent(id: string): Promise<boolean> {
    return this.trackingEvents.delete(id);
  }

  async getTrackingStats(): Promise<{
    totalPackages: number;
    inTransit: number;
    delivered: number;
    thisMonth: number;
  }> {
    const trackings = Array.from(this.trackingNumbers.values());
    const thisMonth = new Date();
    thisMonth.setDate(1);

    return {
      totalPackages: trackings.length,
      inTransit: trackings.filter(t => 
        t.currentStatus.includes('Transit') || 
        t.currentStatus.includes('Processing') ||
        t.currentStatus.includes('Received')
      ).length,
      delivered: trackings.filter(t => t.currentStatus === 'Delivered').length,
      thisMonth: trackings.filter(t => new Date(t.createdAt) >= thisMonth).length,
    };
  }
}

export const storage = new MemStorage();
