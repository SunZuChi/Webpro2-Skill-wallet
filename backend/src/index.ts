import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { cors } from '@elysiajs/cors';

import { authRoute } from './api/auth.route';
import { badgeRoute } from './api/badge.route';
import { badgeRequestRoute } from './api/badge_request.route';

const app = new Elysia({ serve: { maxRequestBodySize: 50 * 1024 * 1024 } }) // 50MB limit
    .use(swagger({
        path: '/swagger',
        documentation: {
            info: {
                title: 'WebBadge API',
                version: '1.0.0'
            }
        }
    }))
    .use(cors())
    .onError(({ code, error, set }) => {
        console.error(`[Elysia Error] ${code}:`, error);
        set.status = typeof set.status === 'number' && set.status !== 200 ? set.status : 500;
        return {
            status: "error",
            message: error.message || "Internal Server Error",
            code: code
        };
    })
    .use(authRoute)
    .use(badgeRoute)
    .use(badgeRequestRoute)
    .listen(3001);

console.log(`Elysia is running at http://localhost:3001`);
console.log(`Test Login at http://localhost:3001/swagger`);
// Trigger restart 2