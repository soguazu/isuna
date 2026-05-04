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
                }
            },
            schemas: {
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
    apis: ['src/routes/**/*.ts', 'src/modules/**/*.routes.ts']
});
