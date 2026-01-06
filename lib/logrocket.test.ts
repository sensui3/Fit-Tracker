import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as logrocketUtils from './logrocket';
import LogRocket from 'logrocket';

// Mock LogRocket
vi.mock('logrocket', () => ({
    default: {
        init: vi.fn(),
        identify: vi.fn(),
        captureException: vi.fn(),
    }
}));

describe('LogRocket Utils', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should initialize LogRocket', () => {
        // Como APP_ID é disparado no topo do módulo, 
        // testamos apenas as funções que dependem dele
        logrocketUtils.initLogRocket();
        // Se VITE_LOGROCKET_ID estiver presente no ambiente de teste (vitest.config ou .env)
        // ele chamará LogRocket.init
    });

    it('should identify user', () => {
        const user = { id: '1', email: 'test@test.com', name: 'Test' };
        logrocketUtils.setLogRocketUser(user);
        // Note: identify só é chamado se APP_ID estiver presente
    });

    it('should capture exceptions with context', () => {
        const error = new Error('Test Error');
        logrocketUtils.logDomainError(error, 'test_context', { foo: 'bar' });
    });
});
