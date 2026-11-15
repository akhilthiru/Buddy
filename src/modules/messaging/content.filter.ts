export class ContentFilter {
  // Regex to detect Indian phone numbers (+91, spaced, 10 digits starting with 6-9)
  private static readonly PHONE_REGEX =
    /(?:\+?91[\s.-]?)?[6-9]\d{2}[\s.-]?\d{3}[\s.-]?\d{4}|\b[6-9]\d{9}\b/;

  // Regex to detect email addresses
  private static readonly EMAIL_REGEX =
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/;

  // Regex to detect UPI / financial addresses (e.g. 9876543210@oksbi, user@upi)
  private static readonly UPI_REGEX =
    /\b[a-zA-Z0-9.\-_]{2,64}@(oksbi|okhdfcbank|okaxis|okicici|paytm|ybl|apl|upi|axl|ibl)\b/i;

  /**
   * Scans text content for contact information harvesting (FR-23).
   * Returns security warning notice if contact details are detected.
   */
  static scanForContactDetails(content: string): string | undefined {
    const hasPhone = this.PHONE_REGEX.test(content);
    const hasEmail = this.EMAIL_REGEX.test(content);
    const hasUpi = this.UPI_REGEX.test(content);

    if (hasPhone || hasEmail || hasUpi) {
      return 'For your security, keep conversations within Buddy until you meet in person.';
    }

    return undefined;
  }
}
