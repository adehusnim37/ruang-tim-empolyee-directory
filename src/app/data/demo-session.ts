import { Injectable, signal } from '@angular/core';

export const DEMO_ACCOUNT = { username: 'admin', password: 'admin123' };
const SESSION_KEY = 'ruang-tim-session';

@Injectable({ providedIn: 'root' })
export class DemoSession {
  private readonly active = signal(sessionStorage.getItem(SESSION_KEY) === 'active');
  readonly signedIn = this.active.asReadonly();

  signIn(username: string, password: string): boolean {
    if (username !== DEMO_ACCOUNT.username || password !== DEMO_ACCOUNT.password) {
      return false;
    }

    sessionStorage.setItem(SESSION_KEY, 'active');
    this.active.set(true);
    return true;
  }

  signOut(): void {
    sessionStorage.removeItem(SESSION_KEY);
    this.active.set(false);
  }
}
