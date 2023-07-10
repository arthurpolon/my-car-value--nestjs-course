import { Report } from 'src/reports/report.entity'
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  email: string

  @Column()
  password: string

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[]
}
