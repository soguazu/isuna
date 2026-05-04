import swaggerJsdoc from 'swagger-jsdoc';
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
        components: {
            schemas: {
                CreateProductRequest: {
                    type: 'object',
                    required: ['name', 'description', 'price', 'stockQuantity'],
                    properties: {
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
                        }
                    }
                },
                Product: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            format: 'uuid'
                        },
                        name: {
                            type: 'string'
                        },
                        description: {
                            type: 'string'
                        },
                        price: {
                            type: 'number'
                        },
                        stockQuantity: {
                            type: 'integer'
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
                ProductSuccessResponse: {
                    type: 'object',
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
                ErrorResponse: {
                    type: 'object',
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
                                type: 'object',
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
                            }
                        }
                    }
                }
            }
        }
    },
    apis: ['src/routes/**/*.ts']
});
