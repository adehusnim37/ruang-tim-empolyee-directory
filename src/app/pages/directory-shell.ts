import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

import { DemoSession } from '../data/demo-session';

@Component({
  imports: [RouterLink, RouterOutlet],
  template: `
    <div class="app-layout">
      <aside class="sidebar">
        <a class="brand" routerLink="/employees" aria-label="Ruang Tim, daftar karyawan">
          <span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
          <span>Ruang Tim</span>
        </a>

        <nav aria-label="Navigasi utama">
          <a class="nav-link" routerLink="/employees" queryParamsHandling="preserve">
            <span class="directory-icon" aria-hidden="true"></span>Karyawan
          </a>
        </nav>

        <div class="sidebar-account">
          <span class="account-avatar" aria-hidden="true">AD</span>
          <span class="account-name">Admin demo</span>
          <button class="sign-out" type="button" (click)="signOut()">Keluar</button>
        </div>
      </aside>

      <main class="workspace" id="main-content">
        <router-outlet />
      </main>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DirectoryShell {
  private readonly session = inject(DemoSession);
  private readonly router = inject(Router);

  signOut(): void {
    this.session.signOut();
    void this.router.navigateByUrl('/login');
  }
}
