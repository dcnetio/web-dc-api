export function isExpectedThreadDBAbsence(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error || "");
  return /^(?:db|thread) not found$/i.test(message.trim());
}
