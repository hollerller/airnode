import { Entity, PrimaryColumn, Column } from 'typeorm';

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
  @Column()
  createdAt: Date;
  @Column()
  lastSeen: Date;
}
