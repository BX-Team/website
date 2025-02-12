import { NextResponse } from 'next/server';

import { uploadToR2 } from '@/lib/r2Client';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: Request) {
  const token = request.headers.get('Authorization');
  if (!token || token !== process.env.CREATE_AUTH_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const uploadKey = searchParams.get('key');
  if (!uploadKey) {
    return NextResponse.json({ error: 'Missing upload key' }, { status: 400 });
  }

  const { data: csData, error: csError } = await supabase
    .from('creation_state')
    .select('*')
    .eq('id', uploadKey)
    .single();
  if (csError || !csData) {
    return NextResponse.json({ error: 'Invalid upload key' }, { status: 400 });
  }

  const fileBuffer = Buffer.from(await request.arrayBuffer());
  const contentType = request.headers.get('Content-Type') || 'application/octet-stream';

  const fileExtension = csData.file_extension || 'jar';

  const buildId = csData.build_id;
  const { data: buildData, error: buildError } = await supabase.from('build').select('*').eq('id', buildId).single();
  if (buildError || !buildData) {
    return NextResponse.json({ error: 'Build not found' }, { status: 404 });
  }

  const { data: versionData, error: versionError } = await supabase
    .from('version')
    .select('*')
    .eq('id', buildData.version_id)
    .single();
  if (versionError || !versionData) {
    return NextResponse.json({ error: 'Version not found' }, { status: 404 });
  }
  const { data: projectData, error: projectError } = await supabase
    .from('project')
    .select('*')
    .eq('id', versionData.project_id)
    .single();
  if (projectError || !projectData) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  const fileName = `${projectData.name}-${versionData.name}-${buildData.name}.${fileExtension}`;

  try {
    await uploadToR2(fileName, fileBuffer, contentType);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: 'File upload failed' }, { status: 500 });
  }

  const { error: fileError } = await supabase.from('file').insert({
    content_type: contentType,
    file_extension: fileExtension,
    build_id: buildData.id,
  });
  if (fileError) {
    return NextResponse.json({ error: fileError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
