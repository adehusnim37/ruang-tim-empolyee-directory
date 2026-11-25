export const GROUPS = [
  'Administrasi', 'Data & Analitik', 'Desain', 'Keuangan', 'Layanan Pelanggan',
  'Operasional', 'Pemasaran', 'Produk', 'SDM', 'Teknologi',
] as const;

export const STATUSES = ['Aktif', 'Nonaktif'] as const;

export interface EmployeeInput {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  basicSalary: number;
  status: string;
  group: string;
  description: string;
}

export interface Employee extends EmployeeInput {
  id: string;
}

const firstNames = [
  'Aditya', 'Amanda', 'Andika', 'Ayu', 'Bagus', 'Citra', 'Damar', 'Dewi', 'Fajar', 'Hana',
  'Intan', 'Joko', 'Karina', 'Laras', 'Maya', 'Nabila', 'Putra', 'Raka', 'Rina', 'Sari',
];
const lastNames = ['Pratama', 'Saputra', 'Mahendra', 'Wijaya', 'Kusuma', 'Utami'];

export function createSampleEmployees(): Employee[] {
  return lastNames.flatMap((lastName, batch) => firstNames.map((firstName, index) => {
    const order = batch * firstNames.length + index;
    const username = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`;
    const month = String(1 + (order % 12)).padStart(2, '0');
    const day = String(1 + ((order * 7) % 28)).padStart(2, '0');

    return {
      id: `sample-${order + 1}`,
      username,
      firstName,
      lastName,
      email: `${username}@example.com`,
      birthDate: `${1985 + ((order * 3) % 19)}-${month}-${day}T08:00`,
      basicSalary: 5_250_000 + ((order * 11) % 57) * 175_000,
      status: STATUSES[Number(order % 9 === 7)],
      group: GROUPS[(index + batch * 3) % GROUPS.length],
      description: `2024-${month}-${day}T09:00`,
    };
  }));
}
