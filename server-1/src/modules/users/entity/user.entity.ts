import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class User {
  @ApiProperty({
    description: 'Unique identifier for the user',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Full name of the user',
    example: 'John Doe',
    maxLength: 255,
  })
  @Column({ type: 'varchar', length: 255 })
  fullName: string;

  @ApiProperty({
    description: 'Email address of the user (must be unique)',
    example: 'john.doe@example.com',
    maxLength: 255,
  })
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @ApiProperty({
    description: 'Message from the user',
    example: 'Hello, I would like to get in touch!'
  })
  @Column({ type: 'text' })
  message: string;

  @ApiProperty({
    description: 'Timestamp when the user was created',
    example: '2024-01-15T10:30:00Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the user was last updated',
    example: '2024-01-15T10:30:00Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
