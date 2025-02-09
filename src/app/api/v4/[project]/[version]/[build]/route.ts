import { NextResponse } from 'next/server';

import { supabase } from '@/lib/supabaseClient';

export async function GET(
  request: Request,
  props: { params: Promise<{ project: string; version: string; build: string }> },
) {
  const params = await props.params;
  const { project, version, build } = params;

  const { data: projectData, error: projectError } = await supabase
    .from('project')
    .select('*')
    .eq('name', project)
    .single();
  if (projectError || !projectData) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  const { data: versionData, error: versionError } = await supabase
    .from('version')
    .select('*')
    .eq('name', version)
    .eq('project_id', projectData.id)
    .single();
  if (versionError || !versionData) {
    return NextResponse.json({ error: 'Version not found' }, { status: 404 });
  }

  const { data: buildData, error: buildError } = await supabase
    .from('build')
    .select('*, commit(*), metadata(*)')
    .eq('name', build)
    .eq('version_id', versionData.id)
    .single();
  if (buildError || !buildData) {
    return NextResponse.json({ error: 'Build not found' }, { status: 404 });
  }

  return NextResponse.json(buildData);
}
