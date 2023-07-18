import { DataSource, DataSourceOptions as TOptions } from 'typeorm'

export const dataSourceOptions: TOptions = (() => {
  if (!process.env.NODE_ENV) throw new Error('unknown environment')

  const common: TOptions = {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    migrations: ['dist/db/migrations/*.js'],
    migrationsRun: true,
  }

  const development: TOptions = {
    ...common,
  }

  const test: TOptions = {
    ...common,
    dropSchema: true,
  }

  const production: TOptions = {
    ssl: {
      rejectUnauthorized: false,
    },
    ...common,
  }

  const options: Record<NodeJS.ProcessEnv['NODE_ENV'], TOptions> = {
    development,
    test,
    production,
  }

  return options[process.env.NODE_ENV]
})()

const dataSource = new DataSource(dataSourceOptions)

export default dataSource
