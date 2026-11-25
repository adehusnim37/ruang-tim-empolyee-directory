import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { EmployeeStore } from '../data/employee-store';

const currency = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const date = new Intl.DateTimeFormat('id-ID', { dateStyle: 'long' });
const dateTime = new Intl.DateTimeFormat('id-ID', { dateStyle: 'long', timeStyle: 'short' });

@Component({
  imports: [RouterLink],
  templateUrl: './employee-detail.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(EmployeeStore);
  private readonly params = toSignal(this.route.paramMap, {
    initialValue: this.route.snapshot.paramMap,
  });

  protected readonly employee = computed(() =>
    this.store.employees().find((entry) => entry.id === this.params().get('id')),
  );
  protected readonly currency = currency;
  protected readonly date = date;
  protected readonly dateTime = dateTime;

  protected dateValue(value: string): Date {
    return new Date(value);
  }
}
