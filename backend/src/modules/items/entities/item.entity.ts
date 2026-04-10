import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

export enum ItemStatus {
  AVAILABLE = 'AVAILABLE',
  SWAPPED = 'SWAPPED',
}

@Entity('items')
export class Item {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 150 })
  title!: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description!: string | null;

  @Column({ length: 100 })
  category!: string;

  @Column({ length: 50 })
  condition!: string; // e.g. NEW / USED

  @Column({ name: 'owner_id' })
  ownerId!: string;

  @Column({
    type: 'enum',
    enum: ItemStatus,
    default: ItemStatus.AVAILABLE,
  })
  status!: ItemStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt!: Date | null;
}