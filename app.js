/**
 * Main Sora Prompt Bot
 * Orchestrates all modules to provide chatbot functionality
 */
class SoraPromptBot {
    constructor() {
        // Initialize modules
        this.config = Config;
        this.knowledgeLoader = new KnowledgeLoader();
        this.apiHandler = new APIHandler(this.config);
        this.messageHandler = new MessageHandler();
        this.uiManager = new UIManager(this.config, () => this.clearConversation());
        this.modelSelector = new ModelSelector(this.config, (modelId) => {
            this.apiHandler.setModel(modelId);
        });
        
        // State
        this.conversationHistory = [];
        this.responseStartTime = null;
        
        // Initialize
        this.initializeEventListeners();
        this.checkApiKey();
        this.loadKnowledgeFiles();
        this.modelSelector.initialize();
    }

    initializeEventListeners() {
        this.uiManager.initializeEventListeners(
            () => this.sendMessage(),
            () => this.clearConversation()
        );
    }

    checkApiKey() {
        if (!this.config.getApiKey()) {
            this.uiManager.showApiKeyDialog((apiKey) => {
                this.config.setApiKey(apiKey);
            });
        }
    }

    async loadKnowledgeFiles() {
        await this.knowledgeLoader.loadKnowledgeFiles();
    }

    async sendMessage() {
        const messageInput = document.getElementById('messageInput');
        const message = messageInput.value.trim();
        
        if (!message || !this.config.getApiKey()) return;

        // Add user message to chat
        this.messageHandler.addMessage(message, 'user');
        messageInput.value = '';
        const sendBtn = document.getElementById('sendBtn');
        sendBtn.disabled = true;

        // Show typing indicator
        this.messageHandler.showTypingIndicator();
        this.responseStartTime = Date.now();

        try {
            await this.callOpenRouterAPIStreaming(message);
        } catch (error) {
            const responseTime = Date.now() - (this.responseStartTime || Date.now());
            this.messageHandler.addMessage('Sorry, I encountered an error. Please check your API key and try again.', 'assistant', true, responseTime);
            console.error('API Error:', error);
        }
    }

    async callOpenRouterAPIStreaming(message) {
        // Ensure knowledge files are loaded and build system prompt
        await this.knowledgeLoader.ensureKnowledgeFilesLoaded();
        const systemPrompt = this.knowledgeLoader.buildSystemPrompt();
        
        // Add conversation history
        const messages = [
            { role: 'system', content: systemPrompt },
            ...this.conversationHistory.slice(-10), // Keep last 10 messages for context
            { role: 'user', content: message }
        ];

        // Create streaming message element
        this.messageHandler.createStreamingMessage();
        
        // Stream response
        const result = await this.apiHandler.streamChatCompletion(
            messages,
            (content) => {
                // Update streaming message as chunks arrive
                this.messageHandler.updateStreamingMessage(content);
            },
            (fullContent, usage, costInfo) => {
                // Track usage
                if (usage && window.costTracker) {
                    const modelId = this.apiHandler.getModel();
                    window.costTracker.recordUsage(usage, costInfo, modelId);
                    
                    // Trigger stats update if stats page is visible
                    if (window.updateStatsDisplay) {
                        window.updateStatsDisplay();
                    }
                }
                
                // Finalize message when streaming completes
                const responseTime = Date.now() - this.responseStartTime;
                this.messageHandler.finalizeStreamingMessage(fullContent, responseTime, usage, costInfo);
                
                // Add to conversation history
                this.conversationHistory.push({ role: 'user', content: message });
                this.conversationHistory.push({ role: 'assistant', content: fullContent });
                
                // Save to history manager
                if (window.historyManager) {
                    window.historyManager.addConversation(message, fullContent);
                }
            }
        );
    }

    clearConversation() {
        this.messageHandler.clearConversation();
        this.conversationHistory = [];
        // Clear prompt cache ID when conversation is cleared
        this.apiHandler.clearCache();
    }
}

// Initialize the chatbot when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Initialize cost tracker
    window.costTracker = new CostTracker();
    
    // Recalculate old costs with new pricing
    window.costTracker.recalculateHistoryCosts();
    
    // Initialize stats manager
    window.statsManager = new StatsManager();
    
    // Initialize history manager
    window.historyManager = new HistoryManager();
    
    // Initialize the chatbot
    new SoraPromptBot();
    
    // Initialize history UI
    initializeHistoryUI();
});

// Add fade-in animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fade-in {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in {
        animation: fade-in 0.3s ease-out;
    }
`;
document.head.appendChild(style);

// History UI Management
function initializeHistoryUI() {
    const historyList = document.getElementById('historyList');
    const historyEmpty = document.getElementById('historyEmpty');
    const historySearch = document.getElementById('historySearch');
    const historyModal = document.getElementById('historyModal');
    const closeHistoryModal = document.getElementById('closeHistoryModal');
    const modalCopyResponse = document.getElementById('modalCopyResponse');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');
    const refreshHistoryBtn = document.getElementById('refreshHistoryBtn');
    
    let currentModalEntry = null;
    
    // Helper to escape HTML
    const escapeHtml = (text) => {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    };
    
    // Update history display
    window.updateHistoryDisplay = (searchQuery = '') => {
        const history = searchQuery 
            ? window.historyManager.searchHistory(searchQuery)
            : window.historyManager.getHistory();
        
        if (history.length === 0) {
            historyList.style.display = 'none';
            historyEmpty.style.display = 'block';
        } else {
            historyList.style.display = 'flex';
            historyEmpty.style.display = 'none';
            
            historyList.innerHTML = history.map(entry => {
                const preview = escapeHtml(entry.preview);
                const response = escapeHtml(entry.assistantResponse.substring(0, 200));
                return `
                    <div class="history-item" data-id="${escapeHtml(entry.id)}">
                        <div class="history-item-header">
                            <div class="history-item-preview">${preview}</div>
                            <div class="history-item-time">${window.historyManager.formatTimestamp(entry.timestamp)}</div>
                        </div>
                        <div class="history-item-response">${response}</div>
                        <div class="history-item-actions">
                            <button class="btn-secondary" onclick="viewHistoryItem('${escapeHtml(entry.id)}')">View Full</button>
                            <button class="btn-secondary" onclick="copyHistoryResponse('${escapeHtml(entry.id)}')">
                                <svg class="w-4 h-4 inline-block" style="vertical-align: middle;"><use href="#icon-copy"></use></svg>
                            </button>
                            <button class="btn-danger" onclick="deleteHistoryItem('${escapeHtml(entry.id)}')">
                                <svg class="w-4 h-4 inline-block" style="vertical-align: middle;"><use href="#icon-trash"></use></svg>
                            </button>
                        </div>
                    </div>
                `;
            }).join('');
        }
    };
    
    // View history item in modal
    window.viewHistoryItem = (id) => {
        const entry = window.historyManager.getEntryById(id);
        if (entry) {
            currentModalEntry = entry;
            document.getElementById('modalUserMessage').textContent = entry.userMessage;
            document.getElementById('modalAssistantResponse').textContent = entry.assistantResponse;
            historyModal.classList.add('active');
        }
    };
    
    // Copy history response
    window.copyHistoryResponse = async (id) => {
        const entry = window.historyManager.getEntryById(id);
        if (entry) {
            try {
                await navigator.clipboard.writeText(entry.assistantResponse);
                // Could show a toast notification here
                console.log('Response copied to clipboard');
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        }
    };
    
    // Delete history item
    window.deleteHistoryItem = (id) => {
        if (confirm('Delete this conversation from history?')) {
            window.historyManager.deleteEntry(id);
            window.updateHistoryDisplay(historySearch.value);
        }
    };
    
    // Search history
    if (historySearch) {
        historySearch.addEventListener('input', (e) => {
            window.updateHistoryDisplay(e.target.value);
        });
    }
    
    // Close modal
    if (closeHistoryModal) {
        closeHistoryModal.addEventListener('click', () => {
            historyModal.classList.remove('active');
        });
    }
    
    // Close modal on background click
    if (historyModal) {
        historyModal.addEventListener('click', (e) => {
            if (e.target === historyModal) {
                historyModal.classList.remove('active');
            }
        });
    }
    
    // Copy from modal
    if (modalCopyResponse) {
        modalCopyResponse.addEventListener('click', async () => {
            if (currentModalEntry) {
                try {
                    await navigator.clipboard.writeText(currentModalEntry.assistantResponse);
                    modalCopyResponse.innerHTML = `
                        <svg class="w-4 h-4 inline-block mr-1.5" style="vertical-align: middle;"><use href="#icon-check"></use></svg>
                        Copied!
                    `;
                    setTimeout(() => {
                        modalCopyResponse.innerHTML = `
                            <svg class="w-4 h-4 inline-block mr-1.5" style="vertical-align: middle;"><use href="#icon-copy"></use></svg>
                            Copy Response
                        `;
                    }, 2000);
                } catch (err) {
                    console.error('Failed to copy:', err);
                }
            }
        });
    }
    
    // Clear all history
    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', () => {
            if (confirm('Clear all conversation history? This cannot be undone.')) {
                window.historyManager.clearHistory();
                window.updateHistoryDisplay();
            }
        });
    }
    
    // Refresh history
    if (refreshHistoryBtn) {
        refreshHistoryBtn.addEventListener('click', () => {
            window.updateHistoryDisplay(historySearch.value);
        });
    }
    
    // Initial display
    window.updateHistoryDisplay();
}
