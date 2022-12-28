import 'dotenv/config';
import path from 'path';
import Koa from 'koa';
import bodyparser from 'koa-bodyparser';
import serve from 'koa-static';

import './db';
import koaSwagger from 'koa-swagger-generator-api';
import router from './router';

const app = new Koa();

const swagger = koaSwagger(app);

const options = {
    swaggerDefinition: {
        info: {
            description: 'Gyant SDET QA Challenge API',
            title: 'Gyant SDET QA Challenge API Swagger',
            version: '1.0.0',
        },
        produces: [
            'application/json',
            'application/xml',
        ],
        schemes: ['http', 'https'],
        securityDefinitions: {
            JWT: {
                type: 'apiKey',
                in: 'header',
                name: 'Authorization',
                description: '',
            },
        },
    },
    basedir: __dirname,
    files: ['./router/*.js'],
};

swagger(options);

app.listen(3000);
app
    .use(bodyparser())
    .use(router.routes())
    .use(router.allowedMethods())
    .use(serve(path.resolve('./client')));
