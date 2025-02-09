import { NextResponse } from 'next/server';

import { supabase } from '@/lib/supabaseClient';

export async function GET(request: Request, props: { params: Promise<{ project: string; version: string }> }) {
  const params = await props.params;
  const { project, version } = params;
  const { searchParams } = new URL(request.url);
  const detailed = searchParams.get('detailed') === 'true';

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

  const buildsSelect = detailed ? '*, commit(*), metadata(*)' : '*';
  const { data: buildsData, error: buildsError } = await supabase
    .from('build')
    .select(buildsSelect)
    .eq('version_id', versionData.id)
    .order('name', { ascending: true });
  if (buildsError) {
    return NextResponse.json({ error: buildsError.message }, { status: 500 });
  }
  if (!buildsData || buildsData.length === 0) {
    return NextResponse.json({ error: 'No builds found' }, { status: 404 });
  }

  const latestBuild = buildsData[buildsData.length - 1];

  if (detailed) {
    return NextResponse.json({
      project,
      version,
      builds: {
        latest: latestBuild,
        all: buildsData,
      },
    });
  } else {
    const buildNames = buildsData.map((b: any) => b.name);
    return NextResponse.json({
      project,
      version,
      builds: {
        latest: (latestBuild as any).name,
        all: buildNames,
      },
    });
  }
}
