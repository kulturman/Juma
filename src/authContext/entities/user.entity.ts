import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullname: string;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({
    name: 'email_verified_at',
    nullable: true,
    default: null,
    type: 'timestamp',
  })
  emailVerifiedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
  Oui;

  async setPassword(password: string) {
    this.password = await bcrypt.hashSync(password, 10);
  }
}
