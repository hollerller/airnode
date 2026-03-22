import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

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
  @Column()
  lastSeen: Date;
}
