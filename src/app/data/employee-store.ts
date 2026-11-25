import { Injectable, signal } from '@angular/core';

import { createSampleEmployees, Employee, EmployeeInput } from './employee';

const STORAGE_KEY = 'ruang-tim-added-employees-v1';

function readAddedEmployees(): Employee[] {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

@Injectable({ providedIn: 'root' })
export class EmployeeStore {
  private readonly entries = signal([...readAddedEmployees(), ...createSampleEmployees()]);
  readonly employees = this.entries.asReadonly();

  add(input: EmployeeInput): void {
    const employee = { ...input, id: crypto.randomUUID() };
    const added = [employee, ...readAddedEmployees()];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(added));
    this.entries.set([...added, ...createSampleEmployees()]);
  }
}
