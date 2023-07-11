import { Report } from 'src/reports/report.entity'
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ default: false })
  admin: boolean

  @Column()
  email: string

  @Column()
  password: string

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[]
}
