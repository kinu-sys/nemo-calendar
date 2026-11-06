/** 日本の祝日・休日名を YYYY-MM-DD をキーにして返す。 */
export function getJapaneseHolidays(year: number): Map<string, string> {
  const holidays = new Map<string, string>();
  const add = (date: Date, name: string) => {
    holidays.set(toDateKey(date), name);
  };
  const nthWeekday = (y: number, m: number, weekday: number, nth: number) =>
    1 + ((weekday - new Date(y, m, 1).getDay() + 7) % 7) + (nth - 1) * 7;
  const vernalEquinox = (y: number) => Math.floor(20.8431 + 0.242194 * (y - 1980) - Math.floor((y - 1980) / 4));
  const autumnalEquinox = (y: number) => Math.floor(23.2488 + 0.242194 * (y - 1980) - Math.floor((y - 1980) / 4));

  // 前後年も作り、年をまたぐ振替休日を扱う。
  for (let y = year - 1; y <= year + 1; y++) {
    const fixed = [
      [0, 1, '元日'], [1, 11, '建国記念の日'], [1, 23, '天皇誕生日'],
      [3, 29, '昭和の日'], [4, 3, '憲法記念日'], [4, 4, 'みどりの日'],
      [4, 5, 'こどもの日'], [7, 11, '山の日'], [10, 3, '文化の日'],
      [10, 23, '勤労感謝の日'],
    ] as const;
    fixed.forEach(([m, d, name]) => add(new Date(y, m, d), name));
    add(new Date(y, 0, nthWeekday(y, 0, 1, 2)), '成人の日');
    add(new Date(y, 6, nthWeekday(y, 6, 1, 3)), '海の日');
    add(new Date(y, 8, nthWeekday(y, 8, 1, 3)), '敬老の日');
    add(new Date(y, 9, nthWeekday(y, 9, 1, 2)), 'スポーツの日');
    add(new Date(y, 2, vernalEquinox(y)), '春分の日');
    add(new Date(y, 8, autumnalEquinox(y)), '秋分の日');
  }

  // 祝日に挟まれた平日を「国民の休日」とする。
  for (let y = year - 1; y <= year + 1; y++) {
    const date = new Date(y, 0, 2);
    while (date.getFullYear() === y) {
      const key = toDateKey(date);
      const previous = new Date(date);
      const next = new Date(date);
      previous.setDate(previous.getDate() - 1);
      next.setDate(next.getDate() + 1);
      if (!holidays.has(key) && holidays.has(toDateKey(previous)) && holidays.has(toDateKey(next))) {
        holidays.set(key, '国民の休日');
      }
      date.setDate(date.getDate() + 1);
    }
  }

  // 日曜の祝日は、次の祝日でない日を振替休日にする。
  for (const [key] of [...holidays]) {
    const date = parseDateKey(key);
    if (date.getDay() !== 0) continue;
    const observed = new Date(date);
    do {
      observed.setDate(observed.getDate() + 1);
    } while (holidays.has(toDateKey(observed)));
    holidays.set(toDateKey(observed), '振替休日');
  }

  return new Map([...holidays].filter(([key]) => key.startsWith(`${year}-`)));
}

function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function parseDateKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}
