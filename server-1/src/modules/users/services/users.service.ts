import { Injectable, Logger, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from '../dto';
import { User } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MessagingService } from '../../messaging/messaging.service';

@Injectable()
export class UsersService {
    private readonly logger = new Logger(UsersService.name);

    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private messagingService: MessagingService,
    ) { }

    async create(createUserDto: CreateUserDto): Promise<User> {
        try {
            this.logger.log(`Creating new user with email: ${createUserDto.email}`);
            
            // Check if user with email already exists
            const existingUser = await this.usersRepository.findOne({
                where: { email: createUserDto.email }
            });
            
            if (existingUser) {
                this.logger.warn(`User with email ${createUserDto.email} already exists`);
                throw new ConflictException('User with this email already exists');
            }

            const newUser = this.usersRepository.create(createUserDto);
            const savedUser = await this.usersRepository.save(newUser);
            
            this.logger.log(`User created successfully with ID: ${savedUser.id}`);
            
            // Publish email notification to RabbitMQ
            try {
                await this.messagingService.publishEmailNotification({
                    userId: savedUser.id,
                    email: savedUser.email,
                    fullName: savedUser.fullName,
                    message: savedUser.message,
                    timestamp: savedUser.createdAt,
                });
                this.logger.log(`Email notification queued for user: ${savedUser.email}`);
            } catch (error) {
                this.logger.error(`Failed to queue email notification: ${error.message}`, error.stack);
                // Don't fail user creation if email notification fails
            }
            
            return savedUser;
        } catch (error) {
            if (error instanceof ConflictException) {
                throw error;
            }
            
            this.logger.error(`Failed to create user: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Failed to create user');
        }
    }

    async findAll(): Promise<User[]> {
        try {
            return await this.usersRepository.find({
                order: { createdAt: 'DESC' }
            });
        } catch (error) {
            this.logger.error(`Failed to fetch users: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Failed to fetch users');
        }
    }

    async findById(id: string): Promise<User> {
        try {
            const user = await this.usersRepository.findOne({ where: { id } });
            if (!user) {
                throw new ConflictException('User not found');
            }
            return user;
        } catch (error) {
            this.logger.error(`Failed to find user with ID ${id}: ${error.message}`, error.stack);
            throw error;
        }
    }
}
