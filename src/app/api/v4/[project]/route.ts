import { NextResponse } from 'next/server';

import { supabase } from '@/lib/supabaseClient';

export async function GET(request: Request, props: { params: Promise<{ project: string }> }) {
  const params = await props.params;
  const { project } = params;

  const { data: projectData, error: projectError } = await supabase
    .from('project')
    .select('*')
    .eq('name', project)
    .single();
  if (projectError || !projectData) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  const { data: metaData, error: metaError } = await supabase
    .from('project_metadata')
    .select('name, p_value')
    .eq('project_id', projectData.id);
  if (metaError) {
    return NextResponse.json({ error: metaError.message }, { status: 500 });
  }

  const metadata = metaData.reduce((acc: any, cur: any) => {
    acc[cur.name] = cur.p_value;
    return acc;
  }, {});

  const { data: versionsData, error: versionsError } = await supabase
    .from('version')
    .select('name')
    .eq('project_id', projectData.id)
    .order('name', { ascending: true });
  if (versionsError) {
    return NextResponse.json({ error: versionsError.message }, { status: 500 });
  }
  const versions = versionsData.map((item) => item.name);

  return NextResponse.json({
    project: projectData.name,
    metadata,
    versions,
  });
}
