import { describe, expect, it } from 'vitest';
import { openApiSpec } from '@/infra/swagger/openapi.js';

type OpenApiSchema = {
  components?: {
    schemas?: Record<string, unknown>;
    parameters?: Record<string, unknown>;
  };
  paths?: Record<string, Record<string, unknown>>;
};

const spec = openApiSpec as OpenApiSchema;

describe('OpenAPI contract', () => {
  it('documents all versioned API routes', () => {
    expect(Object.keys(spec.paths ?? {}).sort()).toEqual(['/health', '/products', '/products/{id}']);
    expect(Object.keys(spec.paths?.['/health'] ?? {})).toEqual(['get']);
    expect(Object.keys(spec.paths?.['/products'] ?? {}).sort()).toEqual(['get', 'post']);
    expect(Object.keys(spec.paths?.['/products/{id}'] ?? {}).sort()).toEqual(['delete', 'get', 'patch']);
  });

  it('defines reusable request and response schemas', () => {
    expect(Object.keys(spec.components?.schemas ?? {}).sort()).toEqual(
      [
        'CreateProductRequest',
        'DeleteProductSuccessResponse',
        'ErrorDetail',
        'ErrorResponse',
        'HealthStatus',
        'HealthSuccessResponse',
        'Product',
        'ProductListMeta',
        'ProductListSuccessResponse',
        'ProductSuccessResponse',
        'UpdateProductRequest'
      ].sort()
    );
  });

  it('documents product operation status codes', () => {
    expect(operationResponses('/products', 'get')).toEqual(['200', '422']);
    expect(operationResponses('/products', 'post')).toEqual(['201', '422']);
    expect(operationResponses('/products/{id}', 'get')).toEqual(['200', '404', '422']);
    expect(operationResponses('/products/{id}', 'patch')).toEqual(['200', '404', '422']);
    expect(operationResponses('/products/{id}', 'delete')).toEqual(['200', '404', '422']);
  });

  it('documents product id as a reusable UUID path parameter', () => {
    const parameter = spec.components?.parameters?.ProductIdPathParameter;

    expect(parameter).toMatchObject({
      in: 'path',
      name: 'id',
      required: true,
      schema: {
        type: 'string',
        format: 'uuid'
      }
    });
    expect(JSON.stringify(spec.paths?.['/products/{id}'])).toContain('#/components/parameters/ProductIdPathParameter');
  });

  it('includes examples on operation responses and request bodies', () => {
    expect(JSON.stringify(spec.paths?.['/products']?.post)).toContain('CreateProductExample');
    expect(JSON.stringify(spec.paths?.['/products/{id}']?.patch)).toContain('UpdateProductExample');
    expect(JSON.stringify(spec.paths?.['/products']?.get)).toContain('ProductListExample');
    expect(JSON.stringify(spec.paths?.['/products/{id}']?.delete)).toContain('DeleteProductExample');
  });
});

const operationResponses = (path: string, method: string): string[] => {
  const operation = spec.paths?.[path]?.[method] as { responses?: Record<string, unknown> } | undefined;

  return Object.keys(operation?.responses ?? {}).sort();
};
