import {
  ObjectID,
  Column,
  ObjectIdColumn,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('notifications')
class Notification {
  @ObjectIdColumn()
  id: ObjectID;

  @Column({ name: 'recipient_id', type: 'uuid' })
  recipientId: string;

  @Column()
  content: string;

  @Column({ type: 'boolean', default: 'false' })
  read: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

export default Notification;
