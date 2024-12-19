# MediDrill AI 

MediDrill AI is a modern medical report analysis tool that helps users understand their medical reports through natural conversation in both English and Bengali. Built with Next.js and powered by advanced AI, it provides intuitive insights into medical documentation.

![MediDrill AI](https://raw.githubusercontent.com/codenim34/MediDrill/main/public/screenshot.png)

## Features

- **Bilingual Support**: Communicate naturally in both English and Bengali
- **Document Analysis**: Upload and analyze medical reports in various formats (JPG, PNG, PDF)
- **Interactive Chat**: Natural conversation interface for asking questions about your reports
- **Precise Responses**: AI-powered responses with relevant clinical context
- **Dark Mode**: Comfortable viewing experience with light/dark theme support
- **Responsive Design**: Seamless experience across all devices

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Pinecone account
- HuggingFace account
- Google AI (Gemini) API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/codenim34/MediDrill.git
   cd MediDrill
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with:
   ```env
   PINECONE_API_KEY=your_pinecone_api_key
   HUGGINGFACE_TOKEN=your_huggingface_token
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Tech Stack

- **Framework**: Next.js 14
- **UI Components**: Shadcn UI
- **Styling**: Tailwind CSS
- **AI/ML**: 
  - Google Gemini API for text generation
  - HuggingFace for embeddings
  - Pinecone for vector storage
- **Language Support**: English and Bengali (Noto Sans Bengali font)

## Usage

1. **Upload Report**:
   - Click the upload area or drag and drop your medical report
   - Supported formats: JPG, PNG, PDF
   - The AI will process and extract relevant information

2. **Ask Questions**:
   - Type your question in English or Bengali
   - The AI will respond in the same language
   - Get detailed explanations with medical context

3. **View Insights**:
   - See related clinical findings
   - Get comprehensive explanations
   - Access medical terminology in both languages

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Shadcn UI](https://ui.shadcn.com/) for the beautiful components
- [Next.js](https://nextjs.org/) for the amazing framework
- [Google Gemini](https://ai.google.dev/) for the powerful AI capabilities
- [Pinecone](https://www.pinecone.io/) for vector search functionality
- [HuggingFace](https://huggingface.co/) for embeddings
