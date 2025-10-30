/**
 * UI Manager
 * Handles UI components, dialogs, and user interactions
 */
class UIManager {
    constructor(config, onClearConversation) {
        this.config = config;
        this.onClearConversation = onClearConversation;
    }

    showApiKeyDialog(onSave) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <h2 class="text-xl font-bold mb-4">OpenRouter API Key Required</h2>
                <p class="text-gray-600 mb-4">
                    To use this chatbot, you need an OpenRouter API key. 
                    You can get one at <a href="https://openrouter.ai/keys" target="_blank" class="text-blue-600 hover:underline">openrouter.ai/keys</a>
                </p>
                <input 
                    type="password" 
                    id="apiKeyInput" 
                    placeholder="Enter your OpenRouter API key"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
                >
                <div class="flex space-x-3">
                    <button 
                        id="saveApiKeyBtn"
                        class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Save Key
                    </button>
                    <button 
                        id="cancelApiKeyBtn"
                        class="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        document.getElementById('saveApiKeyBtn').addEventListener('click', () => {
            const apiKey = document.getElementById('apiKeyInput').value.trim();
            if (apiKey) {
                if (onSave) {
                    onSave(apiKey);
                }
                document.body.removeChild(modal);
            } else {
                alert('Please enter a valid API key');
            }
        });

        document.getElementById('cancelApiKeyBtn').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
    }

    initializeEventListeners(onSendMessage, onClearConversation) {
        const sendBtn = document.getElementById('sendBtn');
        const messageInput = document.getElementById('messageInput');

        sendBtn.addEventListener('click', () => onSendMessage());
        
        messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onSendMessage();
            }
        });

        // Update send button state
        messageInput.addEventListener('input', () => {
            const hasText = messageInput.value.trim().length > 0;
            sendBtn.disabled = !hasText;
        });
        
        // Initialize button state
        sendBtn.disabled = true;

        // Clear conversation button (if exists)
        const clearBtn = document.getElementById('clearBtn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to clear the conversation?')) {
                    if (onClearConversation) {
                        onClearConversation();
                    }
                }
            });
        }
    }
}

