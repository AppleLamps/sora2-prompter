/**
 * Message Handler
 * Handles rendering and formatting of chat messages
 */
class MessageHandler {
    constructor() {
        this.currentStreamingMessage = null;
        this.currentStreamingContent = null;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    formatMessageContent(text) {
        // Process markdown to HTML
        // Split into lines first for processing
        const lines = text.split('\n');
        let result = [];
        let inList = false;
        let inCodeBlock = false;
        let codeBlockLines = [];
        
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            const trimmed = line.trim();
            
            // Code blocks (```)
            if (trimmed.startsWith('```')) {
                if (inList) {
                    result.push('</ul>');
                    inList = false;
                }
                if (inCodeBlock) {
                    // Join code block lines with newlines to preserve spacing
                    result.push(codeBlockLines.join('\n'));
                    result.push('</pre></code></div>');
                    inCodeBlock = false;
                    codeBlockLines = [];
                } else {
                    result.push(`<div class="code-block-container" style="position: relative; margin: 12px 0;"><code style="display: block; background: #f3f4f6; padding: 12px; border-radius: 8px; overflow-x: auto; position: relative;"><pre style="margin: 0; font-family: monospace; font-size: 0.9em; white-space: pre-wrap;">`);
                    inCodeBlock = true;
                }
                continue;
            }
            
            if (inCodeBlock) {
                codeBlockLines.push(this.escapeHtml(line));
                continue;
            }
            
            // Headers (must check before other processing)
            if (trimmed.startsWith('### ')) {
                if (inList) {
                    result.push('</ul>');
                    inList = false;
                }
                const headerText = trimmed.substring(4).trim();
                result.push(`<h3 style="font-size: 1.1em; font-weight: 600; margin: 16px 0 8px 0; color: #111827;">${this.processInlineMarkdown(headerText)}</h3>`);
                continue;
            } else if (trimmed.startsWith('## ')) {
                if (inList) {
                    result.push('</ul>');
                    inList = false;
                }
                const headerText = trimmed.substring(3).trim();
                result.push(`<h2 style="font-size: 1.2em; font-weight: 600; margin: 18px 0 10px 0; color: #111827;">${this.processInlineMarkdown(headerText)}</h2>`);
                continue;
            } else if (trimmed.startsWith('# ')) {
                if (inList) {
                    result.push('</ul>');
                    inList = false;
                }
                const headerText = trimmed.substring(2).trim();
                result.push(`<h1 style="font-size: 1.3em; font-weight: 600; margin: 20px 0 12px 0; color: #111827;">${this.processInlineMarkdown(headerText)}</h1>`);
                continue;
            }
            
            // Horizontal rules (---)
            if (trimmed.match(/^[-]{3,}$/)) {
                if (inList) {
                    result.push('</ul>');
                    inList = false;
                }
                result.push('<hr style="margin: 12px 0; border: none; border-top: 1px solid #e5e7eb;">');
                continue;
            }
            
            // List items (•, -, or numbered)
            if (trimmed.match(/^[•\-]\s+/) || trimmed.match(/^\d+\.\s+/)) {
                if (!inList) {
                    result.push('<ul style="margin: 8px 0; padding-left: 24px; list-style-type: disc;">');
                    inList = true;
                }
                const itemText = trimmed.replace(/^[•\-]\s+/, '').replace(/^\d+\.\s+/, '');
                result.push(`<li style="margin: 4px 0; line-height: 1.6;">${this.processInlineMarkdown(itemText)}</li>`);
            } else {
                if (inList) {
                    result.push('</ul>');
                    inList = false;
                }
                
                if (trimmed) {
                    const isFirst = result.length === 0;
                    const isLast = i === lines.length - 1;
                    const marginTop = isFirst ? '0' : '4px';
                    const marginBottom = isLast ? '0' : '4px';
                    result.push(`<p style="margin: ${marginTop} 0 ${marginBottom} 0; line-height: 1.7;">${this.processInlineMarkdown(trimmed)}</p>`);
                } else if (i < lines.length - 1) {
                    result.push('<br>');
                }
            }
        }
        
        if (inList) {
            result.push('</ul>');
        }
        if (inCodeBlock) {
            // Join any remaining code block lines with newlines
            if (codeBlockLines.length > 0) {
                result.push(codeBlockLines.join('\n'));
            }
            result.push('</pre></code></div>');
        }
        
        const html = result.length > 0 ? result.join('') : this.processInlineMarkdown(text);
        
        // Add copy buttons to code blocks after rendering
        setTimeout(() => this.addCopyButtonsToCodeBlocks(), 0);
        
        return html;
    }
    
    processInlineMarkdown(text) {
        // Escape HTML first
        let html = this.escapeHtml(text);
        
        // Bold (**text**) - process first
        html = html.replace(/\*\*([^*]+)\*\*/g, '<strong style="font-weight: 600;">$1</strong>');
        
        // Italic (*text*) - process after bold, avoiding conflicts
        // Match single asterisks that aren't part of double asterisks
        html = html.replace(/(^|[^*])\*([^*]+)\*([^*]|$)/g, '$1<em style="font-style: italic;">$2</em>$3');
        
        // Code inline (`code`)
        html = html.replace(/`([^`]+)`/g, '<code style="background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">$1</code>');
        
        return html;
    }

    formatResponseTime(ms) {
        if (ms < 1000) {
            return `${ms}ms`;
        }
        return `${(ms / 1000).toFixed(1)}s`;
    }

    addMessage(content, sender, isError = false, responseTime = null) {
        const messagesArea = document.getElementById('messagesArea');
        const messageDiv = document.createElement('div');
        
        if (sender === 'user') {
            messageDiv.className = 'user-message animate-fade-in';
            messageDiv.innerHTML = `
                <div class="user-bubble">
                    <div class="message-content text-gray-900">${this.escapeHtml(content)}</div>
                </div>
            `;
        } else {
            messageDiv.className = 'assistant-message animate-fade-in';
            const formattedTime = responseTime ? this.formatResponseTime(responseTime) : '597ms';
            
            messageDiv.innerHTML = `
                <div class="assistant-avatar">
                    <svg><use href="#icon-robot"></use></svg>
                </div>
                <div class="assistant-bubble">
                    <div class="message-content text-gray-900">${this.formatMessageContent(content)}</div>
                    <div class="interaction-icons">
                        <button class="icon-button" title="Regenerate"><svg><use href="#icon-refresh"></use></svg></button>
                        <button class="icon-button" title="Read aloud"><svg><use href="#icon-audio"></use></svg></button>
                        <button class="icon-button" title="Add comment"><svg><use href="#icon-comment"></use></svg></button>
                        <button class="icon-button" title="Share"><svg><use href="#icon-share"></use></svg></button>
                        <button class="icon-button" title="Thumbs up"><svg><use href="#icon-thumbs-up"></use></svg></button>
                        <button class="icon-button" title="Thumbs down"><svg><use href="#icon-thumbs-down"></use></svg></button>
                        <button class="icon-button" title="More options"><svg><use href="#icon-more"></use></svg></button>
                        <span class="response-time">${formattedTime}</span>
                    </div>
                </div>
            `;
        }

        messagesArea.appendChild(messageDiv);
        messagesArea.scrollTop = messagesArea.scrollHeight;
        
        // Add copy buttons to code blocks after message is added
        setTimeout(() => this.addCopyButtonsToCodeBlocks(), 100);
    }

    createStreamingMessage() {
        const messagesArea = document.getElementById('messagesArea');
        
        // Remove typing indicator if present
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
        
        // Create message element for streaming
        const messageDiv = document.createElement('div');
        messageDiv.className = 'assistant-message animate-fade-in';
        
        messageDiv.innerHTML = `
            <div class="assistant-avatar">
                <svg><use href="#icon-robot"></use></svg>
            </div>
            <div class="assistant-bubble">
                <div class="message-content text-gray-900"></div>
                <div class="interaction-icons" style="display: none;">
                    <button class="icon-button" title="Regenerate"><svg><use href="#icon-refresh"></use></svg></button>
                    <button class="icon-button" title="Read aloud"><svg><use href="#icon-audio"></use></svg></button>
                    <button class="icon-button" title="Add comment"><svg><use href="#icon-comment"></use></svg></button>
                    <button class="icon-button" title="Share"><svg><use href="#icon-share"></use></svg></button>
                    <button class="icon-button" title="Thumbs up"><svg><use href="#icon-thumbs-up"></use></svg></button>
                    <button class="icon-button" title="Thumbs down"><svg><use href="#icon-thumbs-down"></use></svg></button>
                    <button class="icon-button" title="More options"><svg><use href="#icon-more"></use></svg></button>
                    <span class="response-time"></span>
                </div>
            </div>
        `;
        
        messagesArea.appendChild(messageDiv);
        this.currentStreamingMessage = messageDiv;
        this.currentStreamingContent = messageDiv.querySelector('.message-content');
        messagesArea.scrollTop = messagesArea.scrollHeight;
    }
    
    updateStreamingMessage(content) {
        if (this.currentStreamingContent) {
            this.currentStreamingContent.textContent = content;
            // Auto-scroll to bottom
            const messagesArea = document.getElementById('messagesArea');
            messagesArea.scrollTop = messagesArea.scrollHeight;
        }
    }
    
    finalizeStreamingMessage(content, responseTime, usage, costInfo) {
        if (!this.currentStreamingMessage) return;
        
        const formattedTime = this.formatResponseTime(responseTime);
        
        // Show interaction icons
        const interactionIcons = this.currentStreamingMessage.querySelector('.interaction-icons');
        if (interactionIcons) {
            interactionIcons.style.display = 'flex';
            const timeSpan = interactionIcons.querySelector('.response-time');
            if (timeSpan) {
                let timeText = formattedTime;
                if (usage && window.costTracker) {
                    timeText += ` • ${window.costTracker.formatTokens(usage.total_tokens)} tokens`;
                    if (costInfo) {
                        timeText += ` • ${window.costTracker.formatCost(costInfo.total_cost)}`;
                    }
                }
                timeSpan.textContent = timeText;
            }
        }
        
        // Escape HTML in content and format
        if (this.currentStreamingContent) {
            this.currentStreamingContent.innerHTML = this.formatMessageContent(content);
        }
        
        // Add copy buttons after content is rendered
        setTimeout(() => this.addCopyButtonsToCodeBlocks(), 100);
        
        this.currentStreamingContent = null;
        this.currentStreamingMessage = null;
    }

    showTypingIndicator() {
        const messagesArea = document.getElementById('messagesArea');
        const typingDiv = document.createElement('div');
        typingDiv.id = 'typingIndicator';
        typingDiv.className = 'assistant-message';

        typingDiv.innerHTML = `
            <div class="assistant-avatar">
                <svg><use href="#icon-robot"></use></svg>
            </div>
            <div class="assistant-bubble">
                <div class="typing-indicator">
                    <svg class="w-4 h-4"><use href="#icon-lightbulb"></use></svg>
                    <span>Thinking...</span>
                </div>
                <div class="typing-indicator" style="margin-top: 8px;">
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                </div>
            </div>
        `;

        messagesArea.appendChild(typingDiv);
        messagesArea.scrollTop = messagesArea.scrollHeight;
    }

    removeTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    addCopyButtonsToCodeBlocks() {
        const codeBlocks = document.querySelectorAll('.code-block-container');
        codeBlocks.forEach(container => {
            // Skip if copy button already exists
            if (container.querySelector('.copy-button')) return;
            
            const codeElement = container.querySelector('code');
            if (!codeElement) return;
            
            const preElement = codeElement.querySelector('pre');
            const codeText = preElement ? preElement.textContent : codeElement.textContent;
            
            // Create copy button
            const copyButton = document.createElement('button');
            copyButton.className = 'copy-button';
            copyButton.innerHTML = `
                <svg class="copy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                <svg class="check-icon" style="display: none;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            `;
            copyButton.title = 'Copy prompt';
            
            copyButton.addEventListener('click', async (e) => {
                e.stopPropagation();
                try {
                    await navigator.clipboard.writeText(codeText);
                    copyButton.querySelector('.copy-icon').style.display = 'none';
                    copyButton.querySelector('.check-icon').style.display = 'block';
                    copyButton.title = 'Copied!';
                    
                    setTimeout(() => {
                        copyButton.querySelector('.copy-icon').style.display = 'block';
                        copyButton.querySelector('.check-icon').style.display = 'none';
                        copyButton.title = 'Copy prompt';
                    }, 2000);
                } catch (err) {
                    console.error('Failed to copy:', err);
                }
            });
            
            container.appendChild(copyButton);
        });
    }

    clearConversation() {
        const messagesArea = document.getElementById('messagesArea');
        messagesArea.innerHTML = '';
        
        // Reset streaming state
        this.currentStreamingMessage = null;
        this.currentStreamingContent = null;
        
        // Remove typing indicator if present
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
        
        // Add welcome message
        const welcomeDiv = document.createElement('div');
        welcomeDiv.className = 'assistant-message animate-fade-in';
        welcomeDiv.innerHTML = `
            <div class="assistant-avatar">
                <svg><use href="#icon-robot"></use></svg>
            </div>
            <div class="assistant-bubble">
                <div class="message-content text-gray-900">Hello! I'm your Sora Prompt Engineering Assistant. I can help you create perfect prompts for OpenAI's Sora video generation model.

I have access to comprehensive knowledge including:
• The official Sora 2 prompting guide
• Expert system prompts and best practices
• A wide range of style examples and templates

How can I help you today? You can ask me to:
• Create prompts from your ideas
• Improve existing prompts
• Explain prompting techniques
• Provide style-specific examples
• Help with technical specifications

What would you like to work on?</div>
                <div class="interaction-icons">
                    <button class="icon-button" title="Regenerate"><svg><use href="#icon-refresh"></use></svg></button>
                    <button class="icon-button" title="Read aloud"><svg><use href="#icon-audio"></use></svg></button>
                    <button class="icon-button" title="Add comment"><svg><use href="#icon-comment"></use></svg></button>
                    <button class="icon-button" title="Share"><svg><use href="#icon-share"></use></svg></button>
                    <button class="icon-button" title="Thumbs up"><svg><use href="#icon-thumbs-up"></use></svg></button>
                    <button class="icon-button" title="Thumbs down"><svg><use href="#icon-thumbs-down"></use></svg></button>
                    <button class="icon-button" title="More options"><svg><use href="#icon-more"></use></svg></button>
                    <span class="response-time">597ms</span>
                </div>
            </div>
        `;
        
        messagesArea.appendChild(welcomeDiv);
        messagesArea.scrollTop = 0;
    }
}

