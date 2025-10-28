import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'node:fs';
import path from 'node:path';

import { defaultSettings } from '@/app/admin/settings/defaultSettings';
import { SettingsData, settingsSchema } from '@/app/admin/settings/schema';

const SETTINGS_FILE_PATH = path.join(process.cwd(), 'data', 'admin-settings.json');

async function readSettingsFromDisk(): Promise<SettingsData> {
  try {
    const raw = await fs.readFile(SETTINGS_FILE_PATH, 'utf-8');
    const parsed = JSON.parse(raw);
    const result = settingsSchema.safeParse(parsed);

    if (result.success) {
      return result.data;
    }

    console.warn('[admin/settings] Stored settings failed validation, reverting to defaults');
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException)?.code !== 'ENOENT') {
      console.error('[admin/settings] Failed to read settings file:', error);
    }
  }

  await writeSettingsToDisk(defaultSettings);
  return defaultSettings;
}

async function writeSettingsToDisk(settings: SettingsData): Promise<void> {
  await fs.mkdir(path.dirname(SETTINGS_FILE_PATH), { recursive: true });
  await fs.writeFile(SETTINGS_FILE_PATH, JSON.stringify(settings, null, 2), 'utf-8');
}

export async function GET() {
  try {
    const settings = await readSettingsFromDisk();
    return NextResponse.json(settings, { status: 200 });
  } catch (error) {
    console.error('[admin/settings] GET failed:', error);
    return NextResponse.json({ error: 'Unable to load settings' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const payload = await request.json();
    const result = settingsSchema.safeParse(payload);

    if (!result.success) {
      return NextResponse.json(
        {
          error: 'Invalid settings payload',
          details: result.error.flatten()
        },
        { status: 400 }
      );
    }

    await writeSettingsToDisk(result.data);
    return NextResponse.json(result.data, { status: 200 });
  } catch (error) {
    console.error('[admin/settings] PUT failed:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
