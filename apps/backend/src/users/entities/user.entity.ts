import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  lastName: string;
  @Column({ unique: true })
  email: string;
  @Column()
  hash: string;
  @CreateDateColumn()
  registeredAt: Date;
  @Column()
  lastLogin: Date;
}
