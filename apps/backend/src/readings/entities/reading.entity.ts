import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Reading {
  @PrimaryGeneratedColumn()
  id?: number;
  @Column()
  deviceId: string;
  @Column()
  timestamp: Date;
  @Column()
  createdAt: Date;
  @Column('float')
  temperature_c: number;
  @Column('float')
  humidity_pct: number;
  @Column('float')
  pressure_hpa: number;
  @Column()
  pm1_0_ugm3: number;
  @Column()
  pm2_5_ugm3: number;
  @Column()
  pm10_ugm3: number;
}
