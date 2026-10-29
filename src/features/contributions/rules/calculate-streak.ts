export interface ContributionDay {
  date: string;
  count: number;
}

export interface CurrentStreak {
  current: number;
  atRisk: boolean;
}

export function calculateCurrentStreak(
  days: ContributionDay[],
  today: string,
): CurrentStreak {
  const activeDays = new Set(
    days.filter((day) => day.count > 0).map((day) => day.date),
  );

  const todayDone = activeDays.has(today);
  let cursor = todayDone ? today : previousDay(today);

  let current = 0;
  while (activeDays.has(cursor)) {
    current++;
    cursor = previousDay(cursor);
  }

  return { current, atRisk: !todayDone && current > 0 };
}

export function calculateLongestStreak(days: ContributionDay[]): number {
  const dates = [
    ...new Set(days.filter((day) => day.count > 0).map((day) => day.date)),
  ].sort();

  let longest = 0;
  let run = 0;
  let previous: string | null = null;

  for (const date of dates) {
    run = previous && nextDay(previous) === date ? run + 1 : 1;
    longest = Math.max(longest, run);
    previous = date;
  }

  return longest;
}

function previousDay(date: string): string {
  return shiftDay(date, -1);
}

function nextDay(date: string): string {
  return shiftDay(date, 1);
}

function shiftDay(date: string, amount: number): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + amount);
  return d.toISOString().slice(0, 10);
}
