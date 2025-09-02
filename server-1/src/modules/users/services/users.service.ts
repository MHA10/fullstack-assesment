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
        const startTime = Date.now();
        this.logger.debug('[USER_CREATE] Starting user creation process', {
            email: createUserDto.email,
            fullName: createUserDto.fullName,
            timestamp: new Date().toISOString()
        });
        
        try {
            this.logger.log(`[USER_CREATE] Creating new user with email: ${createUserDto.email}`);
            
            // Check if user with email already exists
            this.logger.debug('[USER_CREATE] Checking for existing user', { email: createUserDto.email });
            const existingUser = await this.usersRepository.findOne({
                where: { email: createUserDto.email }
            });
            
            if (existingUser) {
                this.logger.warn(`[USER_CREATE] User with email ${createUserDto.email} already exists`);
                throw new ConflictException('User with this email already exists');
            }
            
            this.logger.debug('[USER_CREATE] Email is unique, proceeding with creation');

            const newUser = this.usersRepository.create(createUserDto);
            this.logger.debug('[USER_CREATE] Saving user to database', {
                email: newUser.email,
                fullName: newUser.fullName
            });
            
            const savedUser = await this.usersRepository.save(newUser);
            const dbTime = Date.now() - startTime;
            
            this.logger.log(`[USER_CREATE] User created successfully with ID: ${savedUser.id} (DB time: ${dbTime}ms)`);
            
            // Publish email notification to RabbitMQ
            const messagingStartTime = Date.now();
            this.logger.debug('[MESSAGING] Initiating email notification publishing', {
                userId: savedUser.id,
                email: savedUser.email,
                fullName: savedUser.fullName
            });
            
            try {
                await this.messagingService.publishEmailNotification({
                    userId: savedUser.id,
                    email: savedUser.email,
                    fullName: savedUser.fullName,
                    message: savedUser.message,
                    timestamp: savedUser.createdAt,
                });
                const messagingTime = Date.now() - messagingStartTime;
                this.logger.log(`[MESSAGING] Email notification queued successfully for user: ${savedUser.email} (Messaging time: ${messagingTime}ms)`);
            } catch (error) {
                const messagingTime = Date.now() - messagingStartTime;
                this.logger.error(`[MESSAGING] Failed to queue email notification (${messagingTime}ms):`, {
                    error: error.message,
                    userId: savedUser.id,
                    email: savedUser.email,
                    stack: error.stack
                });
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
