export const sanitizeKey = (key: string): string => {
  // Replace spaces and invalid characters with underscores, remove special chars at the start
  let sanitized = key
    .toLowerCase() // Optional: convert to lowercase for consistency
    .replace(/[^a-zA-Z0-9._-]/g, '_') // Replace invalid chars with underscore
    .replace(/^[^a-zA-Z0-9]+/, ''); // Remove special chars from the start

  // Truncate to 36 characters
  sanitized = sanitized.slice(0, 36);

  // Ensure the key is not empty after sanitization
  if (!sanitized) {
    throw new Error(`Invalid attribute key: ${key} resulted in an empty key after sanitization`);
  }

  return sanitized;
};
