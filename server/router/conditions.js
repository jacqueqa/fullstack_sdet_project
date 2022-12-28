import fs from 'fs';
import path from 'path';
import Router from 'koa-router';
import neatCsv from 'neat-csv';
import { ConditionModel } from '../db';
import { handleMongooseError } from '../utils';

const router = new Router({ prefix: '/conditions' });

/**
 * This function comment is parsed by doctrine.
 *
 * @route GET /conditions/
 * @group Conditions - Operations about conditions
 */
router.get('/', async (ctx) => {
    try {
        ctx.body = await ConditionModel.find();
    } catch (err) {
        handleMongooseError(err, ctx);
    }
});

/**
 * This function comment is parsed by doctrine.
 *
 * @route POST /conditions/
 * @group Conditions - Operations about conditions
 * @param {object} body.body - Condition - eg: {"code": "12345","description": "Condition Description"}.
 * @returns {object} 200.
 */
router.post('/', async (ctx) => {
    const { code, description } = ctx.request.body;

    const _condition = new ConditionModel({ code, description });

    try {
        ctx.body = await _condition.save();
    } catch (err) {
        handleMongooseError(err, ctx);
    }
});

/**
 * This function comment is parsed by doctrine.
 *
 * @route POST /conditions/import
 * @group Conditions - Operations about conditions
 */
router.post('/import', async (ctx) => {
    const filePath = path.resolve('./server/data/conditions.csv');
    const conditionsCsv = fs.readFileSync(filePath);
    const conditions = await neatCsv(conditionsCsv, {
        mapHeaders: ({ index }) => ['code', 'description'][index],
        separator: '\t',
    });

    const replacements = conditions.map(({ code, description }) => ({
        replaceOne: {
            filter: { code },
            replacement: { code, description },
            upsert: true,
        },
    }));

    try {
        ctx.body = await ConditionModel.collection.bulkWrite(replacements);
    } catch (err) {
        handleMongooseError(err, ctx);
    }
});

export default router;
