import { DataSource, DataSourceOptions } from 'typeorm'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({
  path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`),
})

export const dataSourceOptions: DataSourceOptions = {
  type: 'sqlite',
  database: process.env.DB_NAME || 'db.sqlite',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  migrations: ['dist/db/migrations/*.js'],
  migrationsRun: true,
}

const dataSource = new DataSource(dataSourceOptions)

export default dataSource
