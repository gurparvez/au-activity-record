export const sanitizeKey = (key: string): string => {
  const sanitized = key
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');

  if (!sanitized) {
    throw new Error(`Invalid attribute key: ${key} resulted in an empty key after sanitization`);
  }

  return sanitized;
};