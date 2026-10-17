import { StartedTestContainer } from 'testcontainers';

declare global {
  var __E2E_CONTAINERS__: StartedTestContainer[] | undefined;
}
