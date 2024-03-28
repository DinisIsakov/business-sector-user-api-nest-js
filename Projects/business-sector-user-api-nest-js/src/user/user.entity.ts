import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: '' })
  surname: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 'Не указан' })
  gender: string;

  @Column({ nullable: true })
  photo: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  registrationDate: Date;
}
