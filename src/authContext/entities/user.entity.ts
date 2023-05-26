import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  static register(userData: {
    email: string;
    password: string;
    fullname: string;
  }): User {
    const user = new User();
    user.fullname = userData.fullname;
    user.password = userData.password;
    user.email = userData.email;
    return user;
  }

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
}
