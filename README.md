# Loans Module Dashboard

A comprehensive React dashboard for managing loans, built with React, Redux, and Bootstrap.

## Features

- **Dashboard View**: Get a quick overview of all your active loans, pending applications, and payment schedules.
- **Loan Management**: View, filter, and search through all your loans.
- **Loan Details**: See detailed information about each loan, including payment history and status.
- **Payment Processing**: Make payments on active loans with various payment methods.
- **Loan Applications**: Apply for new loans with a step-by-step form.
- **Responsive Design**: Works on desktop, tablet, and mobile devices.
- **Dark Mode**: Toggle between light and dark themes for comfortable viewing.

## Technology Stack

- **Frontend**: React.js, Redux Toolkit
- **Routing**: React Router v6
- **Styling**: CSS, Bootstrap 5
- **Forms**: React Hook Form
- **HTTP Client**: Axios
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/loan-dashboard.git
   cd loan-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

To create a production build:

```bash
npm run build
# or
yarn build
```

The build artifacts will be stored in the `dist/` directory.

## Project Structure

```
loan-dashboard/
├── public/               # Static assets
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── layout/       # Layout components (Header, Sidebar, etc.)
│   │   └── ui/           # UI components (LoanCard, PaymentForm, etc.)
│   ├── pages/            # Page components
│   ├── services/         # API services
│   ├── store/            # Redux store configuration
│   │   └── slices/       # Redux slices for state management
│   ├── styles/           # SCSS styles
│   ├── utils/            # Utility functions
│   ├── App.jsx           # Main App component with routing
│   └── main.jsx          # Entry point
├── .eslintrc.cjs         # ESLint configuration
├── vite.config.js        # Vite configuration
└── package.json          # Dependencies and scripts
```

## Mock Data

This project uses mock data for demonstration purposes. In a real-world scenario, this would be replaced with API calls to a backend server.

## Future Enhancements

- User authentication and profile management
- Document upload and management for loan applications
- Notifications system for payment reminders and loan status updates
- Advanced analytics and reporting features
- Integration with payment gateways

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Bootstrap for the responsive UI components
- Redux team for state management tooling
- React Router team for routing capabilities
- Vite team for the fast development environment
