export const sortByNumberAsc = <T,>(arr: T[], key: keyof T): T[] =>
    [...arr].sort((a, b) => (a[key] as number) - (b[key] as number))

export const sortByNumberDesc = <T,>(arr: T[], key: keyof T): T[] =>
    [...arr].sort((a, b) => (b[key] as number) - (a[key] as number))

export const sortByStringAsc = <T,>(arr: T[], key: keyof T): T[] =>
    [...arr].sort((a, b) => String(a[key]).localeCompare(String(b[key])))

export const sortByStringDesc = <T,>(arr: T[], key: keyof T): T[] =>
    [...arr].sort((a, b) => String(b[key]).localeCompare(String(a[key])))