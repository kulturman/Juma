import { Builder, fixturesIterator, Loader, Parser, Resolver } from 'typeorm-fixtures-cli/dist';
import * as path from 'path';
import { getConnection, getRepository } from 'typeorm';

export const loadFixtures = async () => {
    const loader = new Loader();
    loader.load(path.resolve('./fixtures'));
    const resolver = new Resolver();
    const fixtures = resolver.resolve(loader.fixtureConfigs);
    const builder = new Builder(getConnection(), new Parser());

    for (const fixture of fixturesIterator(fixtures)) {
        const entity = await builder.build(fixture);
        await getRepository(entity.constructor.name).save(entity);
    }
}

export const cleanFixtures = async () => {
    const loader = new Loader();
    loader.load(path.resolve('./fixtures'));
    const resolver = new Resolver();
    const fixtures = resolver.resolve(loader.fixtureConfigs);
    const builder = new Builder(getConnection(), new Parser());
    
    for (const fixture of fixturesIterator(fixtures)) {
        const entity = await builder.build(fixture);
        await getRepository(entity.constructor.name).delete({});
    }
}