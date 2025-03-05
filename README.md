# 10X Engineered Materials Dashboard

This is a comprehensive dashboard application for 10X Engineered Materials, providing metrics visualization, reporting, and AI-assisted analytics.

## Features

- **Interactive Dashboard**: View key performance metrics and business statistics at a glance
- **Raw Data Access**: Browse and filter detailed sales and order data
- **Metrics of Interest**: Tabular view of key business metrics with trend indicators
- **Trend Graphs**: Interactive charts and graphs for analyzing business metrics over time
- **Dynamic Metrics**: Real-time parameter adjustment to see how changes affect business outcomes
- **Hypothetical Scenarios**: Create and compare different business scenarios with customizable parameters
- **Monthly Reports**: Generate PDF reports with customizable content and embedded graphs
- **AI Assistant**: Ask questions about your data and get intelligent insights
- **Responsive Design**: Works on desktop and mobile devices with collapsible sidebar

## Technology Stack

- **Framework**: Next.js 15 with React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase
- **Charts**: Chart.js and React-Chartjs-2
- **PDF Generation**: @react-pdf/renderer
- **AI Integration**: Anthropic Claude API

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm or yarn
- Supabase account
- Anthropic API key

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd riccimar5
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Fill in your Supabase and Anthropic API credentials

4. Run the development server:
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

- `/src/app`: Main application code
  - `/dashboard`: Dashboard with key performance indicators and summary charts
  - `/raw-data`: Detailed sales data with filtering and sorting capabilities
  - `/metricsofinterest`: Tabular view of key business metrics with trend indicators
  - `/metricsgraph`: Interactive trend visualization with improved metric selection interface
  - `/dynamic-metrics`: Parameter adjustment tool with real-time metric calculations
  - `/hypothetical-scenarios`: Business scenario creation and comparison tool
  - `/monthly-report`: PDF report generation with customizable content
  - `/ai-assistant`: AI-powered chat interface for data analysis
  - `/components`: Reusable UI components
    - `/layout`: Layout components including Header and collapsible Sidebar
  - `/lib`: Utility functions and API clients
    - `metrics.ts`: Metrics calculation and formatting utilities
    - `supabase.ts`: Supabase database client configuration
    - `anthropic.ts`: Anthropic Claude API integration

## Deployment

This application can be deployed to Vercel or any other Next.js-compatible hosting platform:

```
npm run build
npm run start
```

## Credits

This project combines the functionality of two previous applications:
- riccifeb20: Provided the core metrics functionality and data visualization
- aldea1: Provided the UI design, layout, and flow

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.
