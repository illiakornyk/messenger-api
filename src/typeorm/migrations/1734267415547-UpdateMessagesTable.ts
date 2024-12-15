import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateMessagesTable1734267415547 implements MigrationInterface {
  name = 'UpdateMessagesTable1734267415547';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "messages" DROP CONSTRAINT "FK_2db9cf2b3ca111742793f6c37ce"`,
    );
    await queryRunner.query(
      `ALTER TABLE "messages" DROP CONSTRAINT "FK_36bc604c820bb9adc4c75cd4115"`,
    );
    await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "senderId"`);
    await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "chatId"`);
    await queryRunner.query(
      `ALTER TABLE "messages" ADD "sender_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "messages" ADD "chat_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "messages" ADD CONSTRAINT "FK_22133395bd13b970ccd0c34ab22" FOREIGN KEY ("sender_id") REFERENCES "user_accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "messages" ADD CONSTRAINT "FK_7540635fef1922f0b156b9ef74f" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "messages" DROP CONSTRAINT "FK_7540635fef1922f0b156b9ef74f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "messages" DROP CONSTRAINT "FK_22133395bd13b970ccd0c34ab22"`,
    );
    await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "chat_id"`);
    await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "sender_id"`);
    await queryRunner.query(
      `ALTER TABLE "messages" ADD "chatId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "messages" ADD "senderId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "messages" ADD CONSTRAINT "FK_36bc604c820bb9adc4c75cd4115" FOREIGN KEY ("chatId") REFERENCES "chats"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "messages" ADD CONSTRAINT "FK_2db9cf2b3ca111742793f6c37ce" FOREIGN KEY ("senderId") REFERENCES "user_accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
