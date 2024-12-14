import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateChatsTable1734177712099 implements MigrationInterface {
    name = 'CreateChatsTable1734177712099'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "chats" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0117647b3c4a4e5ff198aeb6206" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "chat_users" ("chat_id" uuid NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_31efa25a44c55b3ceed47f98ba4" PRIMARY KEY ("chat_id", "user_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f60265ed6da63600bad2c5ee8c" ON "chat_users" ("chat_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_9a5f2493e2c02490ceb527649e" ON "chat_users" ("user_id") `);
        await queryRunner.query(`ALTER TABLE "chat_users" ADD CONSTRAINT "FK_f60265ed6da63600bad2c5ee8c4" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "chat_users" ADD CONSTRAINT "FK_9a5f2493e2c02490ceb527649e4" FOREIGN KEY ("user_id") REFERENCES "user_accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chat_users" DROP CONSTRAINT "FK_9a5f2493e2c02490ceb527649e4"`);
        await queryRunner.query(`ALTER TABLE "chat_users" DROP CONSTRAINT "FK_f60265ed6da63600bad2c5ee8c4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9a5f2493e2c02490ceb527649e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f60265ed6da63600bad2c5ee8c"`);
        await queryRunner.query(`DROP TABLE "chat_users"`);
        await queryRunner.query(`DROP TABLE "chats"`);
    }

}
