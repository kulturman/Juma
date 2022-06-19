import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDirectoriesTable1654644165665 implements MigrationInterface {
  name = 'CreateDirectoriesTable1654644165665';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`directories\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`is_directory\` tinyint NOT NULL DEFAULT 1, \`size\` int NOT NULL, \`is_video\` tinyint NOT NULL DEFAULT 0, \`is_audio\` tinyint NOT NULL DEFAULT 0, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`parent_directory_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` CHANGE \`email_verified_at\` \`email_verified_at\` timestamp NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`torrents\` DROP FOREIGN KEY \`FK_bc0ea4b12ab974dc41cc069ef6e\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`torrents\` CHANGE \`user_id\` \`user_id\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`directories\` ADD CONSTRAINT \`FK_5d5444cdf23d425c5538ec839cf\` FOREIGN KEY (\`parent_directory_id\`) REFERENCES \`directories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`torrents\` ADD CONSTRAINT \`FK_bc0ea4b12ab974dc41cc069ef6e\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`torrents\` DROP FOREIGN KEY \`FK_bc0ea4b12ab974dc41cc069ef6e\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`directories\` DROP FOREIGN KEY \`FK_5d5444cdf23d425c5538ec839cf\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`torrents\` CHANGE \`user_id\` \`user_id\` int NULL DEFAULT 'NULL'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`torrents\` ADD CONSTRAINT \`FK_bc0ea4b12ab974dc41cc069ef6e\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` CHANGE \`email_verified_at\` \`email_verified_at\` timestamp NULL DEFAULT 'NULL'`,
    );
    await queryRunner.query(`DROP TABLE \`directories\``);
  }
}
