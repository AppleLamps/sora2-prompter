# Sora Prompt Engineering Assistant

A sophisticated web-based chatbot that helps users craft perfect prompts for OpenAI's Sora video generation model. Powered by OpenRouter API and comprehensive knowledge base.

## Features

- **Expert Knowledge**: Built on the complete Sora 2 prompting guide, system prompts, and extensive style examples
- **Multiple Complexity Levels**: Helps users create light, standard, or ultra-detailed prompts
- **Style-Specific Guidance**: Covers cinematic, documentary, animation, vintage, sci-fi, commercial, social media, abstract, educational, and music video styles
- **Real-Time Assistance**: Interactive chat interface with typing indicators and status updates
- **Conversation Memory**: Maintains context for follow-up questions and iterations
- **Professional UI**: Clean, responsive design with Tailwind CSS

## Quick Start

1. **Get OpenRouter API Key**
   - Visit [OpenRouter.ai](https://openrouter.ai/keys) to get your API key
   - The chatbot will prompt you for this key on first launch

2. **Launch the Application**
   - Open `index.html` in your web browser
   - Enter your OpenRouter API key when prompted
   - Start chatting with the Sora prompt assistant

3. **Usage Examples**
   ```
   "I want to create a video of a robot in a workshop"
   "Make this prompt more cinematic: A person walking in a park"
   "Help me with 1970s film style prompts"
   "What's the difference between light and detailed prompts?"
   ```

## Knowledge Base

The chatbot has access to three comprehensive knowledge files:

### 1. Sora Prompting Guide (`sora2_prompting_guide.markdown`)
- Official Sora 2 prompting techniques and best practices
- Core philosophy and fundamental principles
- Technical specifications and limitations
- Iteration strategies and troubleshooting

### 2. System Prompt (`systemprompt.md`)
- Expert prompt engineering methodology
- Structured approach for different complexity levels
- Quality checklists and best practices
- Communication guidelines for user assistance

### 3. Examples Library (`examples.md`)
- 10+ video style categories with multiple examples
- Progressive complexity from light to ultra-detailed
- Technical specifications for professional production
- Quick reference tables and adaptation guides

## Prompt Complexity Levels

### Light Prompts (Creative Freedom)
- Brief, evocative descriptions
- Focus on core concept and style
- Let Sora fill in creative details

### Standard Prompts (Balanced Control)
- Clear scene descriptions
- Defined camera work and lighting
- Structured actions and timing

### Ultra-Detailed Prompts (Maximum Control)
- Professional production terminology
- Specific camera, lens, and filtration details
- Precise lighting, color grading, and atmosphere
- Technical specifications and shot timing

## Supported Video Styles

- **Live Action Cinematic**: Dramatic scenes, romantic comedy
- **Documentary**: Historical, nature, educational
- **Animation**: 2D/3D hybrid, stop-motion, hand-drawn
- **Vintage & Retro**: 1970s film, 1920s silent film
- **Sci-Fi & Fantasy**: Cyberpunk, fantasy epics
- **Commercial & Corporate**: Tech products, luxury brands
- **Social Media**: TikTok, Instagram reels
- **Abstract & Experimental**: Visual poetry, generative art
- **Educational**: Science tutorials, how-to videos
- **Music Video**: Indie performance, electronic visualizers

## Technical Details

### Frontend
- **HTML5**: Semantic structure and accessibility
- **Tailwind CSS**: Modern, responsive design
- **Vanilla JavaScript**: No framework dependencies
- **Font Awesome**: Professional icons and UI elements

### Backend Integration
- **OpenRouter API**: Access to Claude 3.5 Sonnet
- **RESTful Design**: Standard HTTP requests
- **Error Handling**: Comprehensive error management
- **Local Storage**: Secure API key persistence

### Features
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Keyboard Shortcuts**: Ctrl+Enter to send messages
- **Auto-resize**: Textarea grows with content
- **Status Indicators**: Real-time connection and processing status
- **Conversation Management**: Clear history and maintain context

## API Configuration

The chatbot uses OpenRouter with the following configuration:
- **Model**: `anthropic/claude-3.5-sonnet`
- **Temperature**: `0.7` (balanced creativity and consistency)
- **Max Tokens**: `4000` (comprehensive responses)
- **Context Window**: Last 10 messages for conversation continuity

## Customization

### Adding New Knowledge
1. Update the knowledge files in the project directory
2. Modify the `buildSystemPrompt()` method in `app.js` to include new content
3. Restart the application

### Styling Changes
- Modify Tailwind classes in `index.html`
- Update CSS variables in the `<style>` section
- Add new animations or transitions as needed

### API Configuration
- Change the model in the `callOpenRouterAPI()` method
- Adjust temperature and token limits
- Add additional OpenRouter parameters as required

## Security Notes

- API keys are stored locally in browser localStorage
- No server-side storage of API keys or conversations
- HTTPS recommended for production deployment
- Consider implementing rate limiting for production use

## Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile Browsers**: iOS Safari 14+, Chrome Mobile 90+
- **Features Required**: ES6, Fetch API, Local Storage

## Troubleshooting

### Common Issues

1. **API Key Not Working**
   - Verify the key is correct and active
   - Check OpenRouter account credits
   - Ensure proper network connectivity

2. **Slow Responses**
   - Check internet connection speed
   - Monitor OpenRouter service status
   - Consider reducing max tokens for faster responses

3. **UI Not Loading**
   - Enable JavaScript in browser
   - Check browser console for errors
   - Verify all files are in the same directory

### Error Messages
- **"HTTP error! status: 401"**: Invalid or expired API key
- **"HTTP error! status: 429"**: Rate limit exceeded
- **"HTTP error! status: 500"**: OpenRouter service issue

## Development

### Local Development
1. Clone or download the project files
2. Open `index.html` in a modern web browser
3. Enter your OpenRouter API key when prompted
4. Start testing and developing

### Production Deployment
1. Host files on a web server (Apache, Nginx, etc.)
2. Configure HTTPS for secure API communication
3. Consider implementing authentication for API key management
4. Set up monitoring and error tracking

## License

This project is provided as-is for educational and development purposes. Please ensure compliance with OpenRouter's terms of service and OpenAI's usage policies for Sora.

## Support

For issues related to:
- **OpenRouter API**: Check OpenRouter documentation and status
- **Sora Prompting**: Review the knowledge base files
- **Technical Issues**: Check browser console and network tab

---

Built with ❤️ for the Sora creative community. Transform your ideas into stunning video prompts with expert guidance.
