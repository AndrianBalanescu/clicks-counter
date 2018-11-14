import Koa from 'koa'
import Router from 'koa-router'
import JSON from 'koa-json'
import Logger from 'koa-logger'

import Counter from './counter'
import Redis from 'async-redis'

/* DEFAULTS */
const REDIS_HOST = process.env.REDIS_HOST || 'localhost'
const REDIS_PORT = process.env.REDIS_PORT || 6379
const LISTEN_PORT = process.env.LISTEN_PORT || 3000

const app = new Koa()
const router = new Router()
const redis = Redis.createClient(REDIS_PORT, REDIS_HOST)
const counter = new Counter(redis)

app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

router.put('/clicks/:id', async ctx => {
  counter.incr(ctx.params.id)
  ctx.body = { [ctx.params.id]: await counter.state(ctx.params.id) }
});

router.get('/clicks', async ctx => {
  ctx.body = await counter.list()
});

router.get('/clicks/:id', async ctx => {
  ctx.body = { [ctx.params.id]: await counter.state(ctx.params.id) }
});

app.use(Logger())
   .use(JSON({pretty: true}))
   .use(router.routes())
   .use(router.allowedMethods())

app.listen(LISTEN_PORT)
console.log(`Redis connection: ${REDIS_HOST}:${REDIS_PORT}`)
console.log(`Started at: http://localhost:${LISTEN_PORT}/`)
