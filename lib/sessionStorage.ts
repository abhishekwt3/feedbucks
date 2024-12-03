import { Session } from '@shopify/shopify-api';
import { SessionStorage } from '@shopify/shopify-app-session-storage';
import prisma from './prisma';

export class CustomSessionStorage implements SessionStorage {
  async storeSession(session: Session): Promise<boolean> {
    try {
      await prisma.session.upsert({
        where: { id: session.id },
        update: {
          id: session.id,
          shop: session.shop,
          state: session.state,
          isOnline: session.isOnline,
          accessToken: session.accessToken,
          // Add other fields as needed
        },
        create: {
          id: session.id,
          shop: session.shop,
          state: session.state,
          isOnline: session.isOnline,
          accessToken: session.accessToken,
          // Add other fields as needed
        },
      });
      return true;
    } catch (error) {
      console.error(`Error storing session with ID ${session.id}:`, error);
      return false;
    }
  }

  async loadSession(id: string): Promise<Session | undefined> {
    try {
      const sessionData = await prisma.session.findUnique({
        where: { id },
      });
      if (sessionData) {
        return new Session({
          id: sessionData.id,
          shop: sessionData.shop,
          state: sessionData.state,
          isOnline: sessionData.isOnline,
          accessToken: sessionData.accessToken,
          // Add other fields as needed
        });
      }
    } catch (error) {
      console.error(`Error loading session with ID ${id}:`, error);
    }
    return undefined;
  }

  async deleteSession(id: string): Promise<boolean> {
    try {
      await prisma.session.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      console.error(`Error deleting session with ID ${id}:`, error);
      return false;
    }
  }

  async deleteSessions(ids: string[]): Promise<boolean> {
    if (!ids || ids.length === 0) {
      console.warn('No session IDs provided for deletion.');
      return false;
    }
    try {
      await prisma.session.deleteMany({
        where: {
          id: {
            in: ids,
          },
        },
      });
      return true;
    } catch (error) {
      console.error(`Error deleting sessions with IDs ${ids.join(', ')}:`, error);
      return false;
    }
  }

  async findSessionsByShop(shop: string): Promise<Session[]> {
    try {
      const sessionData = await prisma.session.findMany({
        where: { shop },
      });
      return sessionData.map(data => new Session({
        id: data.id,
        shop: data.shop,
        state: data.state,
        isOnline: data.isOnline,
        accessToken: data.accessToken,
        // Add other fields as needed
      }));
    } catch (error) {
      console.error(`Error finding sessions for shop ${shop}:`, error);
      return [];
    }
  }
}
