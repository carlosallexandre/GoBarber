import Redis from 'ioredis';
import AppError from '@shared/errors/AppError';
import { Response, Request, NextFunction } from 'express';
import { RateLimiterRedis } from 'rate-limiter-flexible';

const redisClient = new Redis(
  Number(process.env.REDIS_PORT),
  process.env.REDIS_HOST,
);

const rateLimiterRedis = new RateLimiterRedis({
  storeClient: redisClient,
  points: 25,
  duration: 1,
});

export default async function rateLimiter(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await rateLimiterRedis.consume(request.ip);
    return next();
  } catch {
    throw new AppError('Too many requests', 429);
  }
}
