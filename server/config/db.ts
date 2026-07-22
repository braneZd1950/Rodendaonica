import mongoose from 'mongoose'

import { MongoMemoryServer } from 'mongodb-memory-server'

import { env } from './env.js'



let memoryServer: MongoMemoryServer | null = null



export function isMemoryDatabase() {

  return env.mongoUri === 'memory'

}



function formatMongoError(error: unknown): Error {

  const message = error instanceof Error ? error.message : String(error)

  const isAtlas = env.mongoUri.includes('mongodb.net') || env.mongoUri.includes('mongodb+srv')

  const isWhitelist =

    message.includes('whitelist') ||

    message.includes('ReplicaSetNoPrimary') ||

    message.includes('ServerSelectionError') ||

    message.includes('ECONNREFUSED') ||

    message.includes('querySrv')



  if (isAtlas && isWhitelist) {

    return new Error(

      [

        'Ne mogu se spojiti na MongoDB Atlas.',

        '',

        'Najčešći uzrok: vaša IP adresa nije na whitelisti.',

        '1. Otvorite https://cloud.mongodb.com → Network Access',

        '2. Add IP Address → „Add Current IP” (ili 0.0.0.0/0 samo za dev)',

        '3. Pričekajte 1–2 minute i ponovno pokrenite server',

        '',

        'Za rad BEZ Atasa postavite u server/.env:',

        '  MONGO_URI=memory',

        '  AUTO_SEED=true',

        '',

        `Izvorna greška: ${message}`,

      ].join('\n'),

    )

  }



  return error instanceof Error ? error : new Error(message)

}



export async function connectDatabase() {

  mongoose.set('strictQuery', true)



  if (isMemoryDatabase()) {

    memoryServer = await MongoMemoryServer.create()

    const uri = memoryServer.getUri('rodendaonica')

    await mongoose.connect(uri)

    console.log('MongoDB connected (in-memory — podaci nestaju pri restartu servera)')

    return

  }



  try {

    await mongoose.connect(env.mongoUri, {

      serverSelectionTimeoutMS: 15_000,

    })

    console.log('MongoDB connected')

  } catch (error) {

    throw formatMongoError(error)

  }

}



export async function disconnectDatabase() {

  await mongoose.disconnect()

  if (memoryServer) {

    await memoryServer.stop()

    memoryServer = null

  }

}


