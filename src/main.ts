import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { AppLogger } from '@common/utils/logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new AppLogger('Bootstrap');

  // Enable validation pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Enable CORS
  app.enableCors();

  const port = process.env.APP_PORT || 3000;

  await app.listen(port, () => {
    logger.log(`🚀 Server is running on port ${port}`, 'Bootstrap');
    logger.log(
      `📁 Environment: ${process.env.NODE_ENV || 'development'}`,
      'Bootstrap',
    );
  });
}

bootstrap().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
