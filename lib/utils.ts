export function cn(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(" ");
}

interface MailtoConfig {
  email: string;
  subject: string;
  body: string;
}

export function buildMailtoHref({ email, subject, body }: MailtoConfig) {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
