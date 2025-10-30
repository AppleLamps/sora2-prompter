/**
 * API Handler
 * Manages all OpenRouter API communication and streaming
 */
class APIHandler {
    constructor(config) {
        this.config = config;
        this.promptCacheId = config.getPromptCacheId();
    }

    getModel() {
        return this.config.getSelectedModel();
    }

    setModel(model) {
        this.config.setSelectedModel(model);
    }

    async streamChatCompletion(messages, onChunk, onComplete) {
        const modelId = this.getModel();
        const requestBody = {
            model: modelId,
            messages: messages,
            temperature: 0.7,
            max_tokens: 4000,
            stream: true
        };
        
        // Add prompt cache ID if available
        if (this.promptCacheId) {
            requestBody.prompt_cache_id = this.promptCacheId;
        }

        const apiKey = this.config.getApiKey();
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': window.location.origin,
                'X-Title': 'Sora Prompt Engineering Assistant'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Check for prompt cache ID in response headers
        const cacheId = response.headers.get('x-prompt-cache-id');
        if (cacheId && cacheId !== this.promptCacheId) {
            this.promptCacheId = cacheId;
            this.config.setPromptCacheId(cacheId);
        }

        // Read streaming response
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullContent = '';
        let buffer = '';
        let usage = null; // Will store usage from final chunk

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = line.slice(6);
                    if (data === '[DONE]') continue;
                    
                    try {
                        const json = JSON.parse(data);
                        
                        // Extract usage from final chunk
                        if (json.usage) {
                            usage = json.usage;
                        }
                        
                        const delta = json.choices?.[0]?.delta?.content;
                        if (delta) {
                            fullContent += delta;
                            if (onChunk) {
                                onChunk(fullContent);
                            }
                        }
                    } catch (e) {
                        // Skip invalid JSON
                    }
                }
            }
        }

        // Calculate cost if we have usage
        const costInfo = usage ? await this.calculateCost(usage, modelId) : null;

        if (onComplete) {
            onComplete(fullContent, usage, costInfo);
        }

        return { content: fullContent, usage, costInfo };
    }

    async calculateCost(usage, modelId) {
        const pricing = await this.getModelPricing(modelId);
        
        if (!pricing) return null;
        
        const promptCost = (usage.prompt_tokens / 1000000) * pricing.prompt;
        const completionCost = (usage.completion_tokens / 1000000) * pricing.completion;
        const totalCost = promptCost + completionCost;
        
        return {
            prompt_tokens: usage.prompt_tokens,
            completion_tokens: usage.completion_tokens,
            total_tokens: usage.total_tokens,
            prompt_cost: promptCost,
            completion_cost: completionCost,
            total_cost: totalCost,
            currency: 'USD'
        };
    }

    async getModelPricing(modelId) {
        // Get local pricing from config
        const allPricing = this.config.getModelPricing();
        if (allPricing[modelId]) {
            return allPricing[modelId];
        }
        
        // Fallback to API if model not in local config
        const cacheKey = `model_pricing_${modelId}`;
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
            const { pricing, timestamp } = JSON.parse(cached);
            // Cache for 24 hours
            if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
                return pricing;
            }
        }
        
        try {
            const response = await fetch('https://openrouter.ai/api/v1/models');
            const data = await response.json();
            const model = data.data.find(m => m.id === modelId);
            
            if (model && model.pricing) {
                const pricing = {
                    prompt: model.pricing.prompt || 0,
                    completion: model.pricing.completion || 0
                };
                
                // Cache it
                localStorage.setItem(cacheKey, JSON.stringify({
                    pricing,
                    timestamp: Date.now()
                }));
                
                return pricing;
            }
        } catch (error) {
            console.error('Failed to fetch model pricing:', error);
        }
        
        return null;
    }

    clearCache() {
        this.promptCacheId = null;
        this.config.clearPromptCacheId();
    }
}

