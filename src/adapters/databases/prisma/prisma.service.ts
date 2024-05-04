import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';
import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  prisma: PrismaClient;
  dbUrl: string;
  readonly logger = new Logger(PrismaService.name);

  constructor(private configService: ConfigService) {}

  /**
   * Connect to the database when the module is initialized.
   */
  async onModuleInit() {
    const dbUrl = await this.getDBUrl();
    if (dbUrl) {
      this.prisma = new PrismaClient({
        log: ['query', 'info', 'warn', 'error'],
        datasources: {
          db: {
            url: dbUrl,
          },
        },
      });

      await this.prisma.$connect();
    } else {
      this.prisma = new PrismaClient({
        log: ['query', 'info', 'warn', 'error'],
      });

      await this.prisma.$connect();
    }
  }

  async getDBUrl(): Promise<string> {
    if (this.dbUrl) {
      this.logger.debug('DB_URL is already set.');
      return this.dbUrl;
    } else if (process.env.AWS_REGION && process.env.SECRET_ID) {
      this.logger.debug('DB_URL is from secret manager');
      const secretsManagerClient = new SecretsManagerClient({
        region: process.env.AWS_REGION,
      });
      const getSecretValueCommand = new GetSecretValueCommand({
        SecretId: process.env.SECRET_ID,
      });
      const getSecretValueCommandResponse = await secretsManagerClient.send(
        getSecretValueCommand,
      );
      const secret = JSON.parse(getSecretValueCommandResponse.SecretString);
      this.dbUrl = `postgresql://${secret.username}:${secret.password}@${secret.host}:${secret.port}/${secret.dbname}?schema=${secret.schema}&connection_limit=1&socket_timeout=3`;

      return this.dbUrl;
    } else {
      this.logger.debug('DB_URL is from Local');
      this.dbUrl = this.configService.getOrThrow('DATABASE_URL');

      return this.dbUrl;
    }
  }

  /**
   * Disconnect from the database when the application is shutting down.
   */
  async onModuleDestroy(): Promise<void> {
    await this.prisma.$disconnect();
  }

  /**
   * A utility function used to clear all database rows for testing.
   */
  async clearDatabase() {
    const modelNames = Prisma.dmmf.datamodel.models.map((model) => model.name);

    for (const modelName of modelNames) {
      await this.prisma[
        modelName[0].toLowerCase() + modelName.slice(1)
      ].deleteMany();
    }
  }
}
