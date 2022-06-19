import { MigrationInterface, QueryRunner } from 'typeorm';

export class deleteDirectoryTable1654806586030 implements MigrationInterface {
  name = 'deleteDirectoryTable1654806586030';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`directories\` DROP FOREIGN KEY \`FK_5d5444cdf23d425c5538ec839cf\``,
    );
    await queryRunner.query(`DROP TABLE \`directories\``);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`directories\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`is_directory\` tinyint NOT NULL DEFAULT 1, \`size\` int NOT NULL, \`is_video\` tinyint NOT NULL DEFAULT 0, \`is_audio\` tinyint NOT NULL DEFAULT 0, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`parent_directory_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`directories\` ADD CONSTRAINT \`FK_5d5444cdf23d425c5538ec839cf\` FOREIGN KEY (\`parent_directory_id\`) REFERENCES \`directories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
