import type { CalendarEvent } from '@/types/database';

export function sortEventsByStartTime(events: CalendarEvent[] = []): CalendarEvent[] {
  return [...events].sort((a, b) => {
    const timeA = a.start_time?.trim();
    const timeB = b.start_time?.trim();
    if (!timeA) return timeB ? 1 : 0;
    if (!timeB) return -1;
    return timeA.localeCompare(timeB);
  });
}
