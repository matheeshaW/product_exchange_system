import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum SwapStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

@Entity('swaps')
export class Swap {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'requester_id' })
  requesterId!: string;

  @Column({ name: 'owner_id' })
  ownerId!: string;

  @Column({ name: 'requested_item_id' })
  requestedItemId!: string;

  @Column({ name: 'offered_item_id' })
  offeredItemId!: string;

  @Column({
    type: 'enum',
    enum: SwapStatus,
    default: SwapStatus.PENDING,
  })
  status!: SwapStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}