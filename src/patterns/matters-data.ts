// Sample data for the Matters dashboard. Every name and number is fictional.
import type { ComboboxOption } from '../components/Combobox';

export type MatterStatus = 'Open' | 'On hold' | 'Closed';

export interface Matter {
  id: string;
  number: string;
  name: string;
  client: string;
  area: string;
  status: MatterStatus;
  due: string; // ISO date
  hours: number;
  mine: boolean;
}

export const matters: Matter[] = [
  { id: '1', number: '26-0412', name: 'Acme v. Globex', client: 'Acme Corporation', area: 'Litigation', status: 'Open', due: '2026-11-12', hours: 64.5, mine: true },
  { id: '2', number: '26-0388', name: 'Initech asset purchase', client: 'Initech', area: 'Mergers & Acquisitions', status: 'Open', due: '2026-11-07', hours: 118, mine: false },
  { id: '3', number: '26-0451', name: 'Hooli trademark opposition', client: 'Hooli', area: 'Intellectual Property', status: 'On hold', due: '2026-12-02', hours: 22.25, mine: true },
  { id: '4', number: '26-0297', name: 'Stark Industries supply dispute', client: 'Stark Industries', area: 'Litigation', status: 'Open', due: '2026-11-05', hours: 203.5, mine: false },
  { id: '5', number: '26-0466', name: 'Umbrella Co. employment review', client: 'Umbrella Co.', area: 'Employment', status: 'Open', due: '2026-11-19', hours: 9, mine: true },
  { id: '6', number: '25-1180', name: 'Wayne Enterprises patent portfolio', client: 'Wayne Enterprises', area: 'Intellectual Property', status: 'Closed', due: '2026-10-21', hours: 341, mine: false },
  { id: '7', number: '26-0473', name: 'Soylent Corp. regulatory filing', client: 'Soylent Corp.', area: 'Regulatory', status: 'Open', due: '2026-11-26', hours: 15.75, mine: true },
  { id: '8', number: '26-0402', name: 'Cyberdyne licensing agreement', client: 'Cyberdyne Systems', area: 'Mergers & Acquisitions', status: 'On hold', due: '2026-12-15', hours: 41, mine: false },
  { id: '9', number: '26-0479', name: 'Tyrell Corp. class action defense', client: 'Tyrell Corporation', area: 'Litigation', status: 'Open', due: '2026-11-08', hours: 87.25, mine: true },
];

export const clientOptions: ComboboxOption[] = Array.from(new Set(matters.map((m) => m.client)))
  .sort()
  .map((client, i) => ({ value: client, label: client, description: `Client ${104230 + i * 1117}` }));

/** Simulates a server search with latency, so the async Combobox path is exercised. */
export function searchMatters(query: string, signal: AbortSignal): Promise<ComboboxOption[]> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      const q = query.toLowerCase();
      resolve(
        matters
          .filter((m) => m.name.toLowerCase().includes(q) || m.number.includes(q) || m.client.toLowerCase().includes(q))
          .map((m) => ({ value: m.id, label: m.name, description: `${m.number} · ${m.client}` })),
      );
    }, 350);
    signal.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(new DOMException('Aborted', 'AbortError'));
    });
  });
}
