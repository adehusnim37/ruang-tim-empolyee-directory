import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';

import { Employee, GROUPS } from '../data/employee';
import { EmployeeStore } from '../data/employee-store';

const PAGE_SIZES = [10, 20, 50, 100];
const collator = new Intl.Collator('id-ID', { sensitivity: 'base' });
const columns = [
  { key: 'name', label: 'Nama karyawan' },
  { key: 'group', label: 'Grup' },
  { key: 'status', label: 'Status' },
] as const;

type SortKey = typeof columns[number]['key'];
type Action = 'edit' | 'delete';

function nameOf(employee: Employee): string {
  return `${employee.firstName} ${employee.lastName}`;
}

function sortValue(employee: Employee, key: SortKey): string {
  return key === 'name' ? nameOf(employee) : employee[key];
}

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './employee-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeListPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly store = inject(EmployeeStore);
  private readonly query = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap,
  });

  protected readonly groups = GROUPS;
  protected readonly columns = columns;
  protected readonly pageSizes = PAGE_SIZES;
  protected readonly nameOf = nameOf;
  protected readonly totalEmployees = computed(() => this.store.employees().length);
  protected readonly notification = signal<{ action: Action; name: string } | null>(null);
  protected readonly filters = inject(FormBuilder).nonNullable.group({
    name: this.query().get('name') ?? '',
    group: this.query().get('group') ?? '',
  });

  protected readonly sort = computed(() => {
    const key = this.query().get('sort');
    const column = columns.find((entry) => entry.key === key);
    return column ? {
      key: column.key,
      direction: this.query().get('direction') === 'desc' ? 'descending' : 'ascending',
    } as const : null;
  });

  protected readonly filteredEmployees = computed(() => {
    const name = (this.query().get('name') ?? '').trim().toLowerCase();
    const group = this.query().get('group');
    const matching = this.store.employees().filter((employee) => {
      const matchesName = nameOf(employee).toLowerCase().includes(name) ||
        employee.username.toLowerCase().includes(name);
      return matchesName && (!group || employee.group === group);
    });
    const sort = this.sort();
    return sort ? matching.sort((left, right) => {
      const comparison = collator.compare(sortValue(left, sort.key), sortValue(right, sort.key));
      return sort.direction === 'descending' ? -comparison : comparison;
    }) : matching;
  });

  protected readonly pageSize = computed(() => {
    const size = Number(this.query().get('size'));
    return PAGE_SIZES.includes(size) ? size : PAGE_SIZES[0];
  });
  protected readonly pageCount = computed(() =>
    Math.max(1, Math.ceil(this.filteredEmployees().length / this.pageSize())),
  );
  protected readonly page = computed(() => {
    const page = Number(this.query().get('page'));
    return Number.isSafeInteger(page) ? Math.min(Math.max(1, page), this.pageCount()) : 1;
  });
  protected readonly firstIndex = computed(() => (this.page() - 1) * this.pageSize());
  protected readonly rows = computed(() =>
    this.filteredEmployees().slice(this.firstIndex(), this.firstIndex() + this.pageSize()),
  );

  protected applyFilters(): void {
    const { name, group } = this.filters.getRawValue();
    this.updateQuery({ name: name.trim() || null, group: group || null, page: null });
  }

  protected clearFilters(): void {
    this.filters.reset({ name: '', group: '' });
    this.applyFilters();
  }

  protected sortBy(key: SortKey): void {
    const sort = this.sort();
    const reverse = sort?.key === key && sort.direction === 'ascending';
    this.updateQuery({ sort: key, direction: reverse ? 'desc' : 'asc', page: null });
  }

  protected changeMobileSort(value: string): void {
    const [sort, direction] = value.split(':');
    this.updateQuery({ sort: sort || null, direction: direction || null, page: null });
  }

  protected directionFor(key: SortKey): 'ascending' | 'descending' | 'none' {
    const sort = this.sort();
    return sort?.key === key ? sort.direction : 'none';
  }

  protected changePageSize(size: string): void {
    this.updateQuery({ size, page: null });
  }

  protected goToPage(page: number): void {
    this.updateQuery({ page });
  }

  protected showAction(action: Action, employee: Employee): void {
    this.notification.set({ action, name: nameOf(employee) });
  }

  private updateQuery(queryParams: Params): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }
}
