import type { AuthRepository } from "../interfaces/auth.repository";
import type { User } from "@/types/auth";

export class LocalStorageAuthRepository implements AuthRepository {
  private readonly CURRENT_USER_KEY = "colmeia_current_user";

  async getCurrentUser(): Promise<User | null> {
    if (typeof window === "undefined" || !window.localStorage) {
      return null;
    }

    try {
      const userData = window.localStorage.getItem(this.CURRENT_USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }

  async saveCurrentUser(user: User): Promise<void> {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
    }
  }

  async clearCurrentUser(): Promise<void> {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.removeItem(this.CURRENT_USER_KEY);
    }
  }
}
