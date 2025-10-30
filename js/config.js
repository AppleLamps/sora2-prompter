/**
 * Configuration and Storage Management
 * Handles API key storage and retrieval via localStorage
 */
class Config {
    static getApiKey() {
        return localStorage.getItem('openrouter_api_key') || '';
    }

    static setApiKey(apiKey) {
        localStorage.setItem('openrouter_api_key', apiKey);
    }

    static getPromptCacheId() {
        return localStorage.getItem('prompt_cache_id') || null;
    }

    static setPromptCacheId(cacheId) {
        if (cacheId) {
            localStorage.setItem('prompt_cache_id', cacheId);
        } else {
            localStorage.removeItem('prompt_cache_id');
        }
    }

    static clearPromptCacheId() {
        localStorage.removeItem('prompt_cache_id');
    }

    static getSelectedModel() {
        return localStorage.getItem('selected_model') || 'x-ai/grok-4-fast';
    }

    static setSelectedModel(model) {
        localStorage.setItem('selected_model', model);
    }

    static getModelPricing() {
        return {
            'z-ai/glm-4.6': { prompt: 0.60, completion: 1.90 },
            'anthropic/claude-haiku-4.5': { prompt: 1, completion: 5 },
            'x-ai/grok-4-fast': { prompt: 0.20, completion: 0.50 },
            'openai/gpt-5-chat': { prompt: 1.25, completion: 10 },
            'inclusionai/ling-1t': { prompt: 0.57, completion: 2.28 },
            'inclusionai/ring-1t': { prompt: 0.57, completion: 2.28 },
            'openai/gpt-5': { prompt: 1.25, completion: 10 },
            'anthropic/claude-sonnet-4.5': { prompt: 3, completion: 15 },
            'moonshotai/kimi-k2-0905': { prompt: 0.39, completion: 1.90 },
            'openai/gpt-5-mini': { prompt: 0.25, completion: 2 },
            'openai/gpt-oss-120b': { prompt: 0.04, completion: 0.40 }
        };
    }

    static getChatMode() {
        return localStorage.getItem('chat_mode') || 'sora';
    }

    static setChatMode(mode) {
        localStorage.setItem('chat_mode', mode);
    }
}

