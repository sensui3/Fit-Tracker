import { describe, it, expect, vi, beforeEach } from 'vitest';
import { dbService } from './databaseService';
import { neon } from '@neondatabase/serverless';

// Mock Neon
vi.mock('@neondatabase/serverless', () => ({
    neon: vi.fn(() => vi.fn())
}));

// Mock LogRocket
vi.mock('../lib/logrocket', () => ({
    logDomainError: vi.fn()
}));

describe('databaseService', () => {
    const mockSql = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (neon as any).mockReturnValue(mockSql);
        // Reset process.env for tests
        vi.stubEnv('DATABASE_URL', 'postgresql://user:pass@localhost/db');
    });

    it('should execute a query successfully', async () => {
        const mockData = [{ id: 1, name: 'Test' }];
        mockSql.mockResolvedValue(mockData);

        const result = await dbService.query('SELECT * FROM users');

        expect(result).toEqual(mockData);
        expect(mockSql).toHaveBeenCalled();
    });

    it('should execute findOne and return a single item', async () => {
        const mockData = [{ id: 1, name: 'Test' }];
        mockSql.mockResolvedValue(mockData);

        const result = await dbService.findOne('SELECT * FROM users WHERE id = $1', 1);

        expect(result).toEqual(mockData[0]);
    });

    it('should return null if findOne finds nothing', async () => {
        mockSql.mockResolvedValue([]);

        const result = await dbService.findOne('SELECT * FROM users WHERE id = $1', 999);

        expect(result).toBeNull();
    });

    it('should throw and log error on failure', async () => {
        const error = new Error('DB Error');
        mockSql.mockRejectedValue(error);

        await expect(dbService.query('INVALID SQL')).rejects.toThrow('DB Error');
    });
});
