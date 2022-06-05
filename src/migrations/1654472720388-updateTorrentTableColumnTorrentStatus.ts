import {MigrationInterface, QueryRunner} from "typeorm";

export class updateTorrentTableColumnTorrentStatus1654472720388 implements MigrationInterface {
    name = 'updateTorrentTableColumnTorrentStatus1654472720388'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`email_verified_at\` \`email_verified_at\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`torrents\` DROP FOREIGN KEY \`FK_bc0ea4b12ab974dc41cc069ef6e\``);
        await queryRunner.query(`ALTER TABLE \`torrents\` CHANGE \`status\` \`status\` set ('QUEUED', 'STARTED', 'COMPLETED', 'SEEDING') NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`torrents\` CHANGE \`user_id\` \`user_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`torrents\` ADD CONSTRAINT \`FK_bc0ea4b12ab974dc41cc069ef6e\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`torrents\` DROP FOREIGN KEY \`FK_bc0ea4b12ab974dc41cc069ef6e\``);
        await queryRunner.query(`ALTER TABLE \`torrents\` CHANGE \`user_id\` \`user_id\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`torrents\` CHANGE \`status\` \`status\` set ('QUEING', 'QUEUED', 'STARTED', 'COMPLETED', 'SEEDING') NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`torrents\` ADD CONSTRAINT \`FK_bc0ea4b12ab974dc41cc069ef6e\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`email_verified_at\` \`email_verified_at\` timestamp NULL DEFAULT 'NULL'`);
    }

}
