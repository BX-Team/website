import { NextResponse } from 'next/server';

import { getR2FileStream } from '@/lib/r2Client';
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
    .select('*')
    .eq('name', build)
    .eq('version_id', versionData.id)
    .single();
  if (buildError || !buildData) {
    return NextResponse.json({ error: 'Build not found' }, { status: 404 });
  }

  const { data: fileData, error: fileError } = await supabase
    .from('file')
    .select('*')
    .eq('build_id', buildData.id)
    .single();
  if (fileError || !fileData) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }

  const r2Key = `builds/${projectData.name}/${versionData.name}/${buildData.name}.${fileData.file_extension}`;
  try {
    const fileResponse = await getR2FileStream(r2Key);
    const readableStream = fileResponse.body as unknown as ReadableStream;
    return new NextResponse(readableStream, {
      headers: {
        'Content-Type': fileResponse.contentType,
        'Content-Disposition': `attachment; filename="${buildData.name}.${fileData.file_extension}"`,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'File download failed' }, { status: 500 });
  }
}
