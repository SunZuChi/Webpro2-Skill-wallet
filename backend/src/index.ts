import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { cors } from '@elysiajs/cors';
import { authRoute } from './api/auth.route';

const app = new Elysia()
    .use(swagger({ 
        path: '/swagger',
        documentation: {
            info: { 
                title: 'WebBadge Auth API', 
                version: '1.0.0' 
            }
        }
    }))
    .use(cors())
    .use(authRoute) // เรียกใช้งาน Route ที่เราแยกไว้
    .listen(3001);

console.log(`Elysia is running at http://localhost:3001`);
console.log(`Test Login at http://localhost:3001/swagger`);