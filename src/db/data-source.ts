import { DataSource, DataSourceOptions } from 'typeorm'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({
  path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`),
})

export const dataSourceOptions: DataSourceOptions = (() => {
  switch (process.env.NODE_ENV) {
    case 'development': {
      return {
        type: 'sqlite',
        database: process.env.DB_NAME || 'db.sqlite',
        entities: [__dirname + '/../**/*.entity.{js,ts}'],
        migrations: ['dist/db/migrations/*.js'],
        migrationsRun: true,
      }
    }
    case 'test': {
      return {
        type: 'sqlite',
        database: process.env.DB_NAME || 'db.sqlite',
        entities: [__dirname + '/../**/*.entity.{js,ts}'],
        migrations: ['dist/db/migrations/*.js'],
        migrationsRun: true,
      }
    }
    case 'production': {
      return {
        type: 'postgres',
        url: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false,
        },
        entities: [__dirname + '/../**/*.entity.{js,ts}'],
        migrations: ['dist/db/migrations/*.js'],
        migrationsRun: true,
      }
    }
    default:
      throw new Error('unknown environment')
  }
})()

const dataSource = new DataSource(dataSourceOptions)

export default dataSource
