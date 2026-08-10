import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class Device {
  @PrimaryColumn()
  deviceId: string;
  @Column()
  deviceName: string;
  @Column()
  firmwareVersion: string;
  @Column()
  batteryMv: number;
  @Column()
  isOnline: boolean;
  @CreateDateColumn()
  createdAt: Date;
  @Column({ nullable: true })
  lastSeen: Date;
  @ManyToOne(() => User, (user) => user.devices)
  user: User;
  @Column({ unique: true })
  deviceToken: string;
  @Column({ type: 'int', default: 300 })
  samplingIntervalSec: number;
  @Column({ nullable: true, type: 'decimal' })
  temperatureThreshold: number;
  @Column({ nullable: true, type: 'decimal' })
  pm25Threshold: number;
}
