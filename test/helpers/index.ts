import {
  Builder,
  fixturesIterator,
  Loader,
  Parser,
  Resolver,
} from 'typeorm-fixtures-cli/dist';
import * as path from 'path';
import * as jwt from 'jsonwebtoken';
import { getConnection, getRepository } from 'typeorm';
import { UserJwtPayload } from '../../src/auth/user-jwt.payload';

export const loadFixtures = async () => {
  const loader = new Loader();
  loader.load(path.resolve('./fixtures'));
  const resolver = new Resolver();
  const fixtures = resolver.resolve(loader.fixtureConfigs);
  const builder = new Builder(getConnection(), new Parser());
  const promises = [];

  for (const fixture of fixturesIterator(fixtures)) {
    const entity = await builder.build(fixture);
    promises.push(getRepository(entity.constructor.name).save(entity));
  }

  await Promise.all(promises);
};

export const cleanFixtures = async () => {
  const loader = new Loader();
  loader.load(path.resolve('./fixtures'));
  const resolver = new Resolver();
  const fixtures = resolver.resolve(loader.fixtureConfigs);
  const builder = new Builder(getConnection(), new Parser());
  const promises = [];

  for (const fixture of fixturesIterator(fixtures)) {
    const entity = await builder.build(fixture);
    promises.push(getRepository(entity.constructor.name).delete({}));
  }

  Promise.all(promises);
};

export const getToken = (id: string, email: string) => {
  return jwt.sign({ id, email }, process.env.JWT_SECRET);
};
