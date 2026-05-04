import path from 'node:path';
import { fileURLToPath } from 'node:url';
import swaggerJsdoc from 'swagger-jsdoc';
const currentDir = path.dirname(fileURLToPath(import.meta.url));
const buildRoot = path.resolve(currentDir, '../..');
const projectRoot = path.resolve(buildRoot, '..');
export const openApiSpec = swaggerJsdoc({
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Product Management API',
            version: '1.0.0'
        },
        servers: [
            {
                url: '/api/v1'
            }
        ],
        paths: {
            '/me': {
                get: {
                    summary: 'Retrieve current user profile',
                    tags: ['Users'],
                    security: [{ bearerAuth: [] }],
                    responses: {
                        '200': {
                            description: 'Current user profile',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/UserSuccessResponse'
                                    }
                                }
                            }
                        },
                        '401': {
                            description: 'Authentication required',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/ErrorResponse'
                                    }
                                }
                            }
                        }
                    }
                },
                patch: {
                    summary: 'Update current user profile',
                    tags: ['Users'],
                    security: [{ bearerAuth: [] }],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/UpdateUserRequest'
                                }
                            }
                        }
                    },
                    responses: {
                        '200': {
                            description: 'Current user profile updated',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/UserSuccessResponse'
                                    }
                                }
                            }
                        },
                        '401': {
                            description: 'Authentication required',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/ErrorResponse'
                                    }
                                }
                            }
                        },
                        '422': {
                            description: 'Validation failed',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/ErrorResponse'
                                    }
                                }
                            }
                        }
                    }
                }
            },
            '/users': {
                get: {
                    summary: 'List users',
                    tags: ['Users'],
                    security: [{ bearerAuth: [] }],
                    responses: {
                        '200': {
                            description: 'Users listed',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/UserListSuccessResponse'
                                    }
                                }
                            }
                        },
                        '401': {
                            description: 'Authentication required'
                        },
                        '403': {
                            description: 'Forbidden'
                        }
                    }
                },
                post: {
                    summary: 'Create user',
                    tags: ['Users'],
                    security: [{ bearerAuth: [] }],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/CreateUserRequest'
                                }
                            }
                        }
                    },
                    responses: {
                        '201': {
                            description: 'User created',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/UserSuccessResponse'
                                    }
                                }
                            }
                        },
                        '401': {
                            description: 'Authentication required'
                        },
                        '403': {
                            description: 'Forbidden'
                        },
                        '409': {
                            description: 'Email already exists'
                        },
                        '422': {
                            description: 'Validation failed'
                        }
                    }
                }
            },
            '/users/{id}': {
                get: {
                    summary: 'Retrieve user',
                    tags: ['Users'],
                    security: [{ bearerAuth: [] }],
                    parameters: [{ $ref: '#/components/parameters/UserIdPathParameter' }],
                    responses: {
                        '200': {
                            description: 'User retrieved',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/UserSuccessResponse'
                                    }
                                }
                            }
                        },
                        '401': {
                            description: 'Authentication required'
                        },
                        '403': {
                            description: 'Forbidden'
                        },
                        '404': {
                            description: 'User not found'
                        },
                        '422': {
                            description: 'Validation failed'
                        }
                    }
                },
                patch: {
                    summary: 'Update user',
                    tags: ['Users'],
                    security: [{ bearerAuth: [] }],
                    parameters: [{ $ref: '#/components/parameters/UserIdPathParameter' }],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/UpdateUserRequest'
                                }
                            }
                        }
                    },
                    responses: {
                        '200': {
                            description: 'User updated',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/UserSuccessResponse'
                                    }
                                }
                            }
                        },
                        '401': {
                            description: 'Authentication required'
                        },
                        '403': {
                            description: 'Forbidden'
                        },
                        '404': {
                            description: 'User not found'
                        },
                        '422': {
                            description: 'Validation failed'
                        }
                    }
                }
            },
            '/users/{id}/disable': {
                patch: {
                    summary: 'Disable user',
                    tags: ['Users'],
                    security: [{ bearerAuth: [] }],
                    parameters: [{ $ref: '#/components/parameters/UserIdPathParameter' }],
                    responses: {
                        '200': {
                            description: 'User disabled',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/UserSuccessResponse'
                                    }
                                }
                            }
                        },
                        '401': {
                            description: 'Authentication required'
                        },
                        '403': {
                            description: 'Forbidden'
                        },
                        '404': {
                            description: 'User not found'
                        },
                        '422': {
                            description: 'Validation failed'
                        }
                    }
                }
            }
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            },
            parameters: {
                ProductIdPathParameter: {
                    in: 'path',
                    name: 'id',
                    required: true,
                    description: 'Product UUID',
                    schema: {
                        type: 'string',
                        format: 'uuid',
                        example: '8d1f3f25-7f9b-4c0f-a3a5-5e3f8f3c9a10'
                    }
                },
                UserIdPathParameter: {
                    in: 'path',
                    name: 'id',
                    required: true,
                    description: 'User UUID',
                    schema: {
                        type: 'string',
                        format: 'uuid',
                        example: '8d1f3f25-7f9b-4c0f-a3a5-5e3f8f3c9a10'
                    }
                }
            },
            schemas: {
                LoginRequest: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: {
                            type: 'string',
                            format: 'email',
                            example: 'super@example.com'
                        },
                        password: {
                            type: 'string',
                            example: 'change-this-password'
                        }
                    }
                },
                AuthenticatedUser: {
                    type: 'object',
                    required: ['id', 'email', 'role'],
                    properties: {
                        id: {
                            type: 'string',
                            example: 'admin'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            example: 'super@example.com'
                        },
                        role: {
                            type: 'string',
                            enum: ['super_admin', 'admin', 'manager', 'viewer'],
                            example: 'super_admin'
                        }
                    }
                },
                User: {
                    type: 'object',
                    required: ['id', 'name', 'email', 'role', 'isActive', 'createdAt', 'updatedAt', 'deletedAt'],
                    properties: {
                        id: {
                            type: 'string',
                            format: 'uuid'
                        },
                        name: {
                            type: 'string',
                            example: 'Super Admin'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            example: 'super@example.com'
                        },
                        role: {
                            type: 'string',
                            enum: ['super_admin', 'admin', 'manager', 'viewer'],
                            example: 'super_admin'
                        },
                        isActive: {
                            type: 'boolean',
                            example: true
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time'
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time'
                        },
                        deletedAt: {
                            type: 'string',
                            format: 'date-time',
                            nullable: true
                        }
                    }
                },
                CreateUserRequest: {
                    type: 'object',
                    required: ['name', 'email', 'password', 'role'],
                    properties: {
                        name: {
                            type: 'string',
                            example: 'Product Manager'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            example: 'manager@example.com'
                        },
                        password: {
                            type: 'string',
                            minLength: 8,
                            example: 'password123'
                        },
                        role: {
                            type: 'string',
                            enum: ['super_admin', 'admin', 'manager', 'viewer'],
                            example: 'manager'
                        }
                    }
                },
                UpdateUserRequest: {
                    type: 'object',
                    minProperties: 1,
                    properties: {
                        name: {
                            type: 'string',
                            example: 'Updated User'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            example: 'updated@example.com'
                        },
                        password: {
                            type: 'string',
                            minLength: 8
                        },
                        role: {
                            type: 'string',
                            enum: ['super_admin', 'admin', 'manager', 'viewer']
                        },
                        isActive: {
                            type: 'boolean'
                        }
                    }
                },
                UserSuccessResponse: {
                    type: 'object',
                    required: ['success', 'data'],
                    properties: {
                        success: {
                            type: 'boolean',
                            example: true
                        },
                        data: {
                            $ref: '#/components/schemas/User'
                        }
                    }
                },
                UserListSuccessResponse: {
                    type: 'object',
                    required: ['success', 'data'],
                    properties: {
                        success: {
                            type: 'boolean',
                            example: true
                        },
                        data: {
                            type: 'array',
                            items: {
                                $ref: '#/components/schemas/User'
                            }
                        }
                    }
                },
                LoginResult: {
                    type: 'object',
                    required: ['token', 'tokenType', 'expiresIn', 'user'],
                    properties: {
                        token: {
                            type: 'string',
                            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
                        },
                        tokenType: {
                            type: 'string',
                            enum: ['Bearer'],
                            example: 'Bearer'
                        },
                        expiresIn: {
                            type: 'integer',
                            example: 3600
                        },
                        user: {
                            $ref: '#/components/schemas/AuthenticatedUser'
                        }
                    }
                },
                LoginSuccessResponse: {
                    type: 'object',
                    required: ['success', 'data'],
                    properties: {
                        success: {
                            type: 'boolean',
                            example: true
                        },
                        data: {
                            $ref: '#/components/schemas/LoginResult'
                        }
                    }
                },
                HealthStatus: {
                    type: 'object',
                    required: ['status', 'apiVersion', 'environment', 'uptime', 'timestamp'],
                    properties: {
                        status: {
                            type: 'string',
                            enum: ['ok'],
                            example: 'ok'
                        },
                        apiVersion: {
                            type: 'string',
                            example: 'v1'
                        },
                        environment: {
                            type: 'string',
                            example: 'development'
                        },
                        uptime: {
                            type: 'number',
                            example: 123.45
                        },
                        timestamp: {
                            type: 'string',
                            format: 'date-time',
                            example: '2026-05-04T10:00:00.000Z'
                        }
                    }
                },
                HealthSuccessResponse: {
                    type: 'object',
                    required: ['success', 'data'],
                    properties: {
                        success: {
                            type: 'boolean',
                            example: true
                        },
                        data: {
                            $ref: '#/components/schemas/HealthStatus'
                        }
                    }
                },
                CreateProductRequest: {
                    type: 'object',
                    required: ['name', 'description', 'price', 'stockQuantity'],
                    properties: {
                        name: {
                            type: 'string',
                            minLength: 1,
                            maxLength: 120,
                            example: 'Wireless Mouse'
                        },
                        description: {
                            type: 'string',
                            minLength: 1,
                            example: 'Ergonomic mouse with USB-C charging'
                        },
                        price: {
                            type: 'number',
                            exclusiveMinimum: 0,
                            example: 59.99
                        },
                        stockQuantity: {
                            type: 'integer',
                            minimum: 0,
                            example: 25
                        }
                    }
                },
                UpdateProductRequest: {
                    type: 'object',
                    minProperties: 1,
                    properties: {
                        name: {
                            type: 'string',
                            minLength: 1,
                            maxLength: 120,
                            example: 'Trackball Mouse'
                        },
                        description: {
                            type: 'string',
                            minLength: 1,
                            example: 'Ergonomic trackball with Bluetooth'
                        },
                        price: {
                            type: 'number',
                            exclusiveMinimum: 0,
                            example: 89.5
                        },
                        stockQuantity: {
                            type: 'integer',
                            minimum: 0,
                            example: 12
                        }
                    }
                },
                Product: {
                    type: 'object',
                    required: ['id', 'name', 'description', 'price', 'stockQuantity', 'createdAt', 'updatedAt', 'deletedAt'],
                    properties: {
                        id: {
                            type: 'string',
                            format: 'uuid',
                            example: '8d1f3f25-7f9b-4c0f-a3a5-5e3f8f3c9a10'
                        },
                        name: {
                            type: 'string',
                            example: 'Wireless Mouse'
                        },
                        description: {
                            type: 'string',
                            example: 'Ergonomic mouse with USB-C charging'
                        },
                        price: {
                            type: 'number',
                            example: 59.99
                        },
                        stockQuantity: {
                            type: 'integer',
                            example: 25
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            example: '2026-05-04T10:00:00.000Z'
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            example: '2026-05-04T10:00:00.000Z'
                        },
                        deletedAt: {
                            type: 'string',
                            format: 'date-time',
                            nullable: true,
                            example: null
                        }
                    }
                },
                ProductSuccessResponse: {
                    type: 'object',
                    required: ['success', 'data'],
                    properties: {
                        success: {
                            type: 'boolean',
                            example: true
                        },
                        data: {
                            $ref: '#/components/schemas/Product'
                        }
                    }
                },
                ProductListMeta: {
                    type: 'object',
                    required: ['page', 'pageSize', 'totalItems', 'totalPages'],
                    properties: {
                        page: {
                            type: 'integer',
                            example: 1
                        },
                        pageSize: {
                            type: 'integer',
                            example: 10
                        },
                        totalItems: {
                            type: 'integer',
                            example: 25
                        },
                        totalPages: {
                            type: 'integer',
                            example: 3
                        }
                    }
                },
                ProductListSuccessResponse: {
                    type: 'object',
                    required: ['success', 'data', 'meta'],
                    properties: {
                        success: {
                            type: 'boolean',
                            example: true
                        },
                        data: {
                            type: 'array',
                            items: {
                                $ref: '#/components/schemas/Product'
                            }
                        },
                        meta: {
                            $ref: '#/components/schemas/ProductListMeta'
                        }
                    }
                },
                DeleteProductSuccessResponse: {
                    type: 'object',
                    required: ['success', 'data'],
                    properties: {
                        success: {
                            type: 'boolean',
                            example: true
                        },
                        data: {
                            type: 'object',
                            required: ['id'],
                            properties: {
                                id: {
                                    type: 'string',
                                    format: 'uuid',
                                    example: '8d1f3f25-7f9b-4c0f-a3a5-5e3f8f3c9a10'
                                }
                            }
                        }
                    }
                },
                ErrorDetail: {
                    type: 'object',
                    required: ['message'],
                    properties: {
                        path: {
                            type: 'string',
                            example: 'name'
                        },
                        message: {
                            type: 'string',
                            example: 'Name is required'
                        }
                    }
                },
                ErrorResponse: {
                    type: 'object',
                    required: ['success', 'message'],
                    properties: {
                        success: {
                            type: 'boolean',
                            example: false
                        },
                        message: {
                            type: 'string',
                            example: 'Validation failed'
                        },
                        errors: {
                            type: 'array',
                            items: {
                                $ref: '#/components/schemas/ErrorDetail'
                            }
                        }
                    }
                }
            }
        }
    },
    apis: [
        path.join(projectRoot, 'src/routes/**/*.ts'),
        path.join(projectRoot, 'src/modules/**/*.routes.ts'),
        path.join(projectRoot, 'dist/routes/**/*.js'),
        path.join(projectRoot, 'dist/modules/**/*.routes.js')
    ]
});
