import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserTable1734175922737 implements MigrationInterface {
    name = 'CreateUserTable1734175922737'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
			CREATE TABLE
			"user_accounts" (
				"id" uuid NOT NULL DEFAULT uuid_generate_v4 (),
				"name" character varying(100) NOT NULL,
				"username" character varying(50) NOT NULL,
				"email" character varying NOT NULL,
				"password" character varying(128) NOT NULL,
				"createdAt" TIMESTAMP NOT NULL DEFAULT now(),
				"updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
				CONSTRAINT "UQ_d45e7ca4a62293443961558c564" UNIQUE ("username"),
				CONSTRAINT "UQ_df3802ec9c31dd9491e3589378d" UNIQUE ("email"),
				CONSTRAINT "PK_125e915cf23ad1cfb43815ce59b" PRIMARY KEY ("id")
			)
			`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user_accounts"`);
    }

}
