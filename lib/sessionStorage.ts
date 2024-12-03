import { Session } from '@shopify/shopify-api';
import { SessionStorage } from '@shopify/shopify-app-session-storage';
import prisma from './prisma';

export class CustomSessionStorage implements SessionStorage {
  async storeSession(session: Session): Promise<boolean> {
    try {
      await prisma.session.upsert({
        where: { id: session.id },
        update: session.toObject(),
        create: session.toObject(),
      });
      return true;
    } catch (error) {
      console.error('Failed to store session:', error);
      return false;
    }
  }

  async loadSession(id: string): Promise<Session | undefined> {
    try {
      const sessionData = await prisma.session.findUnique({
        where: { id },
      });
      if (sessionData) {
        return new Session(sessionData);
      }
    } catch (error) {
      console.error('Failed to load session:', error);
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
      console.error('Failed to delete session:', error);
      return false;
    }
  }

  async deleteSessions(ids: string[]): Promise<boolean> {
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
      console.error('Failed to delete sessions:', error);
      return false;
    }
  }

  async findSessionsByShop(shop: string): Promise<Session[]> {
    try {
      const sessionData = await prisma.session.findMany({
        where: { shop },
      });
      return sessionData.map(data => new Session(data));
    } catch (error) {
      console.error('Failed to find sessions by shop:', error);
      return [];
    }
  }
}

