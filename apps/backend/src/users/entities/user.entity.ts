import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

import { Device } from 'src/devices/entities/device.entity';

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
  @Column()
  refreshToken: string;
  @OneToMany(() => Device, (device) => device.user)
  devices: Device[];
}
