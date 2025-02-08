import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET() {
  const { data, error } = await supabase
    .from('project')
    .select('name');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const projects = data.map((item) => item.name);
  return NextResponse.json({ projects });
}
