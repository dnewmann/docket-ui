import { useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { Button, Modal, Select } from '../index';
import { GuidedTour, type TourStep } from './GuidedTour';
import styles from './DeskBooking.module.css';

/*
 * Desk booking sample: an SVG floor plan with four bookable desks.
 * Original design and fictional data, built only from Docket UI components.
 */

export interface Desk {
  id: string;
  name: string;
  features: string[];
  /** Position of the desk on the 600 x 360 floor plan. */
  x: number;
  y: number;
}

export interface Booking {
  id: string;
  deskId: string;
  date: string; // ISO date
  bookedBy: string;
}

const ME = 'You';

export const desks: Desk[] = [
  { id: 'A1', name: 'Desk A1', features: ['Window', 'Dual monitors'], x: 50, y: 70 },
  { id: 'A2', name: 'Desk A2', features: ['Window', 'Standing desk'], x: 270, y: 70 },
  { id: 'B1', name: 'Desk B1', features: ['Near team room', 'Dual monitors'], x: 50, y: 210 },
  { id: 'B2', name: 'Desk B2', features: ['Quiet zone'], x: 270, y: 210 },
];

const dateOptions = [
  { value: '2026-11-04', label: 'Wed, Nov 4' },
  { value: '2026-11-05', label: 'Thu, Nov 5' },
  { value: '2026-11-06', label: 'Fri, Nov 6' },
  { value: '2026-11-09', label: 'Mon, Nov 9' },
  { value: '2026-11-10', label: 'Tue, Nov 10' },
];
const dateLabel = (iso: string) => dateOptions.find((d) => d.value === iso)?.label ?? iso;

const seedBookings: Booking[] = [
  { id: 'b1', deskId: 'A2', date: '2026-11-04', bookedBy: 'Sam Ortiz' },
  { id: 'b2', deskId: 'B1', date: '2026-11-05', bookedBy: 'Priya Shah' },
  { id: 'b3', deskId: 'B2', date: '2026-11-09', bookedBy: ME },
];

type DeskState = 'available' | 'taken' | 'mine';

const tourSteps: TourStep[] = [
  {
    target: 'day',
    title: 'Pick a day',
    body: 'Desks are booked one day at a time. Change the day to see who is in the office.',
  },
  {
    target: 'map',
    title: 'Choose a desk',
    body: 'Click a desk, or Tab to it and press Enter. White desks are free; a lock means someone else has it; a check means it is yours.',
  },
  {
    target: 'details',
    title: 'Book it',
    body: 'Details for the selected desk appear here, with a button to book it. You can hold one desk per day.',
  },
  {
    target: 'mine',
    title: 'Manage your bookings',
    body: 'Every upcoming booking is listed here. Cancel one to release the desk for someone else.',
  },
];

export function DeskBooking({ initialBookings = seedBookings }: { initialBookings?: Booking[] }) {
  const [date, setDate] = useState(dateOptions[0].value);
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [toCancel, setToCancel] = useState<Booking | null>(null);
  const [message, setMessage] = useState('');
  const [touring, setTouring] = useState(false);
  const helpRef = useRef<HTMLButtonElement>(null);

  const dayBookings = useMemo(() => bookings.filter((b) => b.date === date), [bookings, date]);
  const myBookings = useMemo(
    () => bookings.filter((b) => b.bookedBy === ME).sort((a, b) => a.date.localeCompare(b.date)),
    [bookings],
  );

  const stateOf = (deskId: string): DeskState => {
    const booking = dayBookings.find((b) => b.deskId === deskId);
    if (!booking) return 'available';
    return booking.bookedBy === ME ? 'mine' : 'taken';
  };

  const selected = desks.find((d) => d.id === selectedId) ?? null;
  const selectedBooking = selected ? dayBookings.find((b) => b.deskId === selected.id) : undefined;
  const myBookingToday = dayBookings.find((b) => b.bookedBy === ME);

  function book(desk: Desk) {
    // One desk per person per day: surface the rule instead of silently replacing.
    if (myBookingToday) {
      const current = desks.find((d) => d.id === myBookingToday.deskId)!;
      setMessage(`You already have ${current.name} on ${dateLabel(date)}. Cancel it first to switch desks.`);
      return;
    }
    setBookings((prev) => [...prev, { id: `b${Date.now()}`, deskId: desk.id, date, bookedBy: ME }]);
    setMessage(`Booked ${desk.name} for ${dateLabel(date)}.`);
  }

  function confirmCancel() {
    if (!toCancel) return;
    const desk = desks.find((d) => d.id === toCancel.deskId)!;
    setBookings((prev) => prev.filter((b) => b.id !== toCancel.id));
    setMessage(`Cancelled ${desk.name} on ${dateLabel(toCancel.date)}.`);
    setToCancel(null);
  }

  function onDeskKey(event: KeyboardEvent<SVGGElement>, desk: Desk) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setSelectedId(desk.id);
      setMessage('');
    }
  }

  const stateLabel: Record<DeskState, string> = { available: 'Available', taken: 'Booked', mine: 'Your booking' };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.h1}>Book a desk</h1>
          <p className={styles.subtitle}>Floor 3, west wing. Pick a day, then choose a desk on the map.</p>
        </div>
        <div className={styles.headerActions}>
          <Button
            ref={helpRef}
            variant="secondary"
            onClick={() => setTouring(true)}
            startIcon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14M12 17h.01" />
              </svg>
            }
          >
            How it works
          </Button>
          <div data-tour="day" className={styles.dateSelect}>
            <Select
              label="Day"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setMessage('');
              }}
              options={dateOptions}
            />
          </div>
        </div>
      </header>

      <div className={styles.layout}>
        <section className={styles.mapCard} aria-labelledby="map-title" data-tour="map">
          <div className={styles.cardHeader}>
            <h2 id="map-title" className={styles.h2}>
              Floor plan · {dateLabel(date)}
            </h2>
            <ul className={styles.legend} aria-label="Legend">
              <li>
                <span className={[styles.swatch, styles.available].join(' ')} /> Available
              </li>
              <li>
                <span className={[styles.swatch, styles.taken].join(' ')} /> Booked
              </li>
              <li>
                <span className={[styles.swatch, styles.mine].join(' ')} /> Yours
              </li>
            </ul>
          </div>

          <svg
            className={styles.map}
            viewBox="0 0 600 360"
            role="group"
            aria-label={`Floor plan for ${dateLabel(date)}. Use Tab to move between desks and Enter to select one.`}
          >
            {/* Room shell */}
            <rect x="10" y="10" width="580" height="340" rx="14" className={styles.room} />
            <line x1="40" y1="12" x2="460" y2="12" className={styles.window} />
            <text x="250" y="34" textAnchor="middle" className={styles.roomLabel} aria-hidden="true">
              Windows
            </text>
            <rect x="480" y="200" width="90" height="130" rx="8" className={styles.fixture} />
            <text x="525" y="270" textAnchor="middle" className={styles.roomLabel} aria-hidden="true">
              Team room
            </text>

            {desks.map((desk) => {
              const state = stateOf(desk.id);
              const isSelected = desk.id === selectedId;
              const booking = dayBookings.find((b) => b.deskId === desk.id);
              const label = `${desk.name}, ${stateLabel[state]}${state === 'taken' && booking ? ` by ${booking.bookedBy}` : ''}. ${desk.features.join(', ')}.`;
              return (
                <g
                  key={desk.id}
                  role="button"
                  tabIndex={0}
                  aria-label={label}
                  aria-pressed={isSelected}
                  className={[styles.desk, styles[state], isSelected && styles.selected].filter(Boolean).join(' ')}
                  transform={`translate(${desk.x} ${desk.y})`}
                  onClick={() => {
                    setSelectedId(desk.id);
                    setMessage('');
                  }}
                  onKeyDown={(e) => onDeskKey(e, desk)}
                >
                  <rect className={styles.focusRing} x="-8" y="-8" width="196" height="116" rx="14" />
                  <rect className={styles.deskTop} width="180" height="64" rx="10" />
                  <circle className={styles.chair} cx="90" cy="88" r="12" />
                  <text x="16" y="28" className={styles.deskName} aria-hidden="true">
                    {desk.id}
                  </text>
                  <text x="16" y="48" className={styles.deskState} aria-hidden="true">
                    {stateLabel[state]}
                  </text>
                  {/* Shape, not only color, marks state: a check for yours, a lock for booked. */}
                  {state === 'mine' && <path d="M148 26l6 6 12-14" className={styles.icon} aria-hidden="true" />}
                  {state === 'taken' && (
                    <g className={styles.icon} aria-hidden="true">
                      <rect x="148" y="24" width="18" height="14" rx="3" />
                      <path d="M151 24v-4a6 6 0 0 1 12 0v4" />
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        </section>

        <aside className={styles.side}>
          <section className={styles.panel} aria-labelledby="details-title" data-tour="details">
            <h2 id="details-title" className={styles.h2}>
              {selected ? selected.name : 'Choose a desk'}
            </h2>
            {selected ? (
              <>
                <p className={styles.meta}>{selected.features.join(' • ')}</p>
                <p className={styles.status}>
                  <span className={[styles.pill, styles[stateOf(selected.id)]].join(' ')}>
                    {stateLabel[stateOf(selected.id)]}
                  </span>
                  <span>{dateLabel(date)}</span>
                </p>
                {stateOf(selected.id) === 'available' && (
                  <Button fullWidth onClick={() => book(selected)}>
                    Book {selected.name}
                  </Button>
                )}
                {stateOf(selected.id) === 'taken' && selectedBooking && (
                  <p className={styles.note}>Booked by {selectedBooking.bookedBy}. Try another desk or day.</p>
                )}
                {stateOf(selected.id) === 'mine' && selectedBooking && (
                  <Button variant="secondary" fullWidth onClick={() => setToCancel(selectedBooking)}>
                    Cancel this booking
                  </Button>
                )}
              </>
            ) : (
              <p className={styles.note}>Select a desk on the floor plan to see details and book it.</p>
            )}
            <p className={styles.message} role="status">
              {message}
            </p>
          </section>

          <section className={styles.panel} aria-labelledby="mine-title" data-tour="mine">
            <h2 id="mine-title" className={styles.h2}>
              My bookings
            </h2>
            {myBookings.length === 0 ? (
              <p className={styles.note}>No upcoming bookings.</p>
            ) : (
              <ul className={styles.list}>
                {myBookings.map((b) => {
                  const desk = desks.find((d) => d.id === b.deskId)!;
                  return (
                    <li key={b.id} className={styles.listItem}>
                      <span>
                        <strong>{desk.name}</strong>
                        <span className={styles.meta}>{dateLabel(b.date)}</span>
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        aria-label={`Cancel ${desk.name} on ${dateLabel(b.date)}`}
                        onClick={() => setToCancel(b)}
                      >
                        Cancel
                      </Button>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </aside>
      </div>

      <GuidedTour
        steps={tourSteps}
        open={touring}
        onClose={() => {
          setTouring(false);
          helpRef.current?.focus();
        }}
      />

      <Modal
        open={toCancel !== null}
        onClose={() => setToCancel(null)}
        size="sm"
        title="Cancel this booking?"
        description={
          toCancel
            ? `${desks.find((d) => d.id === toCancel.deskId)?.name} on ${dateLabel(toCancel.date)} will be released for others to book.`
            : undefined
        }
        footer={
          <>
            <Button variant="secondary" onClick={() => setToCancel(null)}>
              Keep booking
            </Button>
            <Button variant="danger" onClick={confirmCancel}>
              Cancel booking
            </Button>
          </>
        }
      />
    </div>
  );
}
