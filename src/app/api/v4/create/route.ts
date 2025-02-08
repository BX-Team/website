import { v4 as uuidv4 } from 'uuid';

import { NextResponse } from 'next/server';

import { supabase } from '@/lib/supabaseClient';

export async function POST(request: Request) {
  const token = request.headers.get('Authorization');
  if (!token || token !== process.env.CREATE_AUTH_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch (err) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { project, version, build, result, timestamp, duration, hash, commits, metadata, file_extension } = body;
  if (!project || !version || !build || !result || !timestamp || !duration || !hash) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  let { data: projectData, error: projectError } = await supabase
    .from('project')
    .select('*')
    .eq('name', project)
    .single();
  if (projectError || !projectData) {
    const { data, error } = await supabase.from('project').insert({ name: project }).select();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    projectData = data[0];
  }

  let { data: versionData, error: versionError } = await supabase
    .from('version')
    .select('*')
    .eq('name', version)
    .eq('project_id', projectData.id)
    .single();
  if (versionError || !versionData) {
    const { data, error } = await supabase
      .from('version')
      .insert({ name: version, project_id: projectData.id })
      .select();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    versionData = data[0];
  }

  const { data: buildData, error: buildError } = await supabase
    .from('build')
    .insert({
      name: build,
      result,
      timestamp,
      duration,
      hash,
      version_id: versionData.id,
      ready: 1,
    })
    .select()
    .single();
  if (buildError) {
    return NextResponse.json({ error: buildError.message }, { status: 500 });
  }

  if (commits && Array.isArray(commits)) {
    for (const commit of commits) {
      const { author, email, description, hash: commitHash, timestamp: commitTimestamp } = commit;
      await supabase.from('commit').insert({
        author,
        email,
        description,
        hash: commitHash,
        timestamp: commitTimestamp,
        build_id: buildData.id,
      });
    }
  }

  if (metadata && typeof metadata === 'object') {
    for (const key in metadata) {
      const p_value = metadata[key];
      await supabase.from('metadata').insert({
        name: key,
        p_value,
        build_id: buildData.id,
      });
    }
  }

  const uploadKey = uuidv4();
  const { error: csError } = await supabase.from('creation_state').insert({
    id: uploadKey,
    file_extension: file_extension || null,
    build_id: buildData.id,
  });
  if (csError) {
    return NextResponse.json({ error: csError.message }, { status: 500 });
  }

  return NextResponse.json({ key: uploadKey });
}
