import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { GROUPS, STATUSES } from '../data/employee';
import { EmployeeStore } from '../data/employee-store';

function todayAtClose(): string {
  const now = new Date();
  const day = new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
  return `${day}T23:59`;
}

function requiredText(control: AbstractControl) {
  return control.value.trim() ? null : { required: true };
}

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './employee-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeFormPage {
  private readonly store = inject(EmployeeStore);
  private readonly router = inject(Router);
  private readonly builder = inject(FormBuilder).nonNullable;

  protected readonly statuses = STATUSES;
  protected readonly lastBirthDate = todayAtClose();
  protected readonly groupSearch = signal('');
  protected readonly formError = signal('');
  protected readonly form = this.builder.group({
    username: ['', requiredText],
    firstName: ['', requiredText],
    lastName: ['', requiredText],
    email: ['', [Validators.required, Validators.email]],
    birthDate: ['', [Validators.required, (control) =>
      control.value > todayAtClose() ? { futureDate: true } : null]],
    basicSalary: this.builder.control<number | null>(null, [Validators.required, Validators.min(0)]),
    status: ['', Validators.required],
    group: ['', Validators.required],
    description: ['', Validators.required],
  });

  protected get matchingGroups(): readonly string[] {
    const query = this.groupSearch().trim().toLowerCase();
    return GROUPS.filter((group) => group.toLowerCase().includes(query));
  }

  protected get visibleGroups(): readonly string[] {
    const selected = this.form.controls.group.value;
    const matches = this.matchingGroups;
    return selected && !matches.includes(selected) ? [selected, ...matches] : matches;
  }

  protected invalid(field: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[field];
    return control.touched && control.invalid;
  }

  protected save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.formError.set('Periksa kembali kolom yang ditandai.');
      return;
    }

    const { username, firstName, lastName, basicSalary, ...rest } = this.form.getRawValue();
    if (basicSalary === null || !Number.isFinite(basicSalary)) {
      this.formError.set('Gaji pokok harus berupa angka.');
      return;
    }

    try {
      this.store.add({
        ...rest,
        username: username.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        basicSalary,
      });
    } catch {
      this.formError.set('Data gagal disimpan. Periksa izin penyimpanan browser lalu coba lagi.');
      return;
    }

    void this.router.navigateByUrl('/employees');
  }
}
