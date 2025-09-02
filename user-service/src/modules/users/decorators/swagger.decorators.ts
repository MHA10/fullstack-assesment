import { applyDecorators } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CreateUserDto } from '../dto';
import { User } from '../entity/user.entity';

/**
 * Swagger decorator for Users controller
 */
export const ApiUsersController = () => applyDecorators(
  ApiTags('users')
);

/**
 * Swagger decorator for Get All Users endpoint
 */
export const ApiGetAllUsers = () => applyDecorators(
  ApiOperation({ summary: 'Get all users' }),
  ApiResponse({
    status: 200,
    description: 'List of all users retrieved successfully',
    type: [User],
  }),
  ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
);

/**
 * Swagger decorator for Get User by ID endpoint
 */
export const ApiGetUserById = () => applyDecorators(
  ApiOperation({ summary: 'Get user by ID' }),
  ApiResponse({
    status: 200,
    description: 'User retrieved successfully',
    type: User,
  }),
  ApiResponse({
    status: 400,
    description: 'Bad request - invalid UUID format',
  }),
  ApiResponse({
    status: 404,
    description: 'User not found',
  }),
  ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
);

/**
 * Swagger decorator for Create User endpoint
 */
export const ApiCreateUser = () => applyDecorators(
  ApiOperation({ summary: 'Create a new user' }),
  ApiBody({ type: CreateUserDto }),
  ApiResponse({
    status: 201,
    description: 'User created successfully and email notification queued',
    type: User,
  }),
  ApiResponse({
    status: 400,
    description: 'Bad request - validation failed',
  }),
  ApiResponse({
    status: 409,
    description: 'Conflict - user with email already exists',
  }),
  ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
);