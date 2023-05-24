import { MigrationInterface, QueryRunner } from 'typeorm';

export class createTorrentTable1653954713019 implements MigrationInterface {
  name = 'createTorrentTable1653954713019';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`torrents\` (\`id\` int NOT NULL AUTO_INCREMENT, \`path\` varchar(255) NOT NULL, \`status\` set ('QUEING', 'QUEUED', 'STARTED', 'COMPLETED', 'SEEDING') NOT NULL, \`progression\` int NOT NULL DEFAULT '0', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`user_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` CHANGE \`email_verified_at\` \`email_verified_at\` timestamp NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`torrents\` ADD CONSTRAINT \`FK_bc0ea4b12ab974dc41cc069ef6e\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE RESTRICT`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`torrents\` DROP FOREIGN KEY \`FK_bc0ea4b12ab974dc41cc069ef6e\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` CHANGE \`email_verified_at\` \`email_verified_at\` timestamp NULL DEFAULT 'NULL'`,
    );
    await queryRunner.query(`DROP TABLE \`torrents\``);
  }
}
