import { redirect, RedirectType } from 'next/navigation';

export async function GET() {
  redirect('https://bxteam.org/docs', RedirectType.replace);
}
