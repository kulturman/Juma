import { rmSync } from 'fs';
import { StartedTestContainer } from 'testcontainers';

export default async () => {
  const containers: StartedTestContainer[] =
    globalThis.__E2E_CONTAINERS__ ?? [];
  await Promise.all(containers.map((container) => container.stop()));

  if (process.env.TORRENTS_STORAGE_PATH) {
    rmSync(process.env.TORRENTS_STORAGE_PATH, { recursive: true, force: true });
  }
};
