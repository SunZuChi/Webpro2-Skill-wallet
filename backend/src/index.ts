import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { cors } from '@elysiajs/cors';
import { authRoute } from './api/auth.route';
import { badgeRoute } from './api/badge.route';
import { feedbackRoute } from './api/feedback.route';
import { profileRoute } from './api/profile.route';
import { verifierRoute } from './api/verifier.route';
import { badgeCatalogRoute } from './api/badgeCatalog.route';

const app = new Elysia()
    .use(swagger({ 
        path: '/swagger',
        documentation: {
            info: { 
                title: 'WebBadge Auth API', 
                version: '1.0.0' 
            },
            tags: [
                { name: 'Auth',         description: 'Authentication endpoints' },
                { name: 'Badge Catalog',description: 'Browse available badges (student selects before requesting)' },
                { name: 'Badge',        description: 'Badge management' },
                { name: 'Feedback',     description: 'Skill verification feedback (Student ↔ Verifier)' },
                { name: 'Profile',      description: 'User & Verifier profile management' },
                { name: 'Verifier',     description: 'Verifier-only: student directory & feedback management' },
                { name: 'Admin Only',   description: 'Admin-only endpoints (use via Swagger)' },
            ]
        }
    }))
    .use(cors())
    .use(authRoute)
    .use(badgeCatalogRoute)
    .use(badgeRoute)
    .use(feedbackRoute)
    .use(profileRoute)
    .use(verifierRoute)
    .listen(3001);

console.log(`Elysia is running at http://localhost:3001`);
console.log(`Test Login at http://localhost:3001/swagger`);