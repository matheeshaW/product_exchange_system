import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('item_images')
export class ItemImage {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'item_id' })
  itemId!: string;

  @Column({ name: 'image_url' })
  imageUrl!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}