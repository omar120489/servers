import 'reflect-metadata';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ReportingModule } from './reporting/reporting.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  try {
    const app = await NestFactory.create(ReportingModule);

    app.enableCors({ origin: '*', credentials: false });
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: false,
      }),
    );

    const portEnv = process.env.PORT;
    const port = portEnv ? Number(portEnv) : 8005;

    if (Number.isNaN(port)) {
      throw new Error(`Invalid PORT value "${portEnv}"`);
    }

    const host = process.env.HOST || '127.0.0.1';
    await app.listen(port, host);

    const url = await app.getUrl();
    logger.log(`🚀 Reporting service listening on ${url}`);
  } catch (err) {
    Logger.error('Failed to bootstrap reporting service', err);
    process.exitCode = 1;
  }
}

bootstrap();
