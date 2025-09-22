export function slugify(str: string, separator: string = '-'): string {
  return str
    .normalize('NFKD') // Decompose accented characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/gi, separator) // Replace non-alphanumeric with separator
    .replace(new RegExp(`${separator}+`, 'g'), separator) // Collapse multiple separators
    .replace(new RegExp(`^${separator}|${separator}$`, 'g'), ''); // Trim separator from ends
}
