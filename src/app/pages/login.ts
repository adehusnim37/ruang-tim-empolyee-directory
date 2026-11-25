import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { DEMO_ACCOUNT, DemoSession } from '../data/demo-session';

@Component({
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {
  protected readonly demo = DEMO_ACCOUNT;
  protected readonly error = signal('');
  protected readonly form = inject(FormBuilder).nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  private readonly session = inject(DemoSession);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  signIn(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error.set('Masukkan username dan kata sandi.');
      return;
    }

    const { username, password } = this.form.getRawValue();
    if (!this.session.signIn(username.trim(), password)) {
      this.error.set('Username atau kata sandi salah.');
      return;
    }

    const returnTo = this.route.snapshot.queryParamMap.get('returnTo') ?? '';
    const isDirectoryPath = /^\/employees(?:[/?]|$)/.test(returnTo);
    void this.router.navigateByUrl(isDirectoryPath ? returnTo : '/employees', { replaceUrl: true });
  }
}
