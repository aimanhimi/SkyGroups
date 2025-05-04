# SkyGrouper - Group Travel Planning Made Simple

SkyGrouper is a modern web application that simplifies group travel planning by coordinating preferences, managing votes, and finding the perfect destination for group trips.

## Features

- **Group Trip Creation**: Create trip groups and invite friends using unique codes
- **Preference Collection**: Gather travel preferences from all group members
- **Destination Voting**: Vote on potential destinations with an intuitive swipe interface
- **Real-time Status**: Track group members' progress through the planning process
- **Results Dashboard**: View analyzed results with match scores and group consensus
- **Responsive Design**: Fully responsive interface that works on all devices

## Tech Stack

- **Frontend**:
  - React 18 with TypeScript
  - Tailwind CSS for styling
  - Framer Motion for animations
  - React Router for navigation
  - Axios for API requests
  - Lucide React for icons

- **Backend**:
  - Flask (Python)
  - MongoDB for data storage
  - Flask-CORS for cross-origin requests

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Python 3.8 or higher
- MongoDB database

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/skygrouper.git
cd skygrouper
```
2. Install frontend dependencies:
```bash
npm install
```
3. Set up Python virtual environment and install backend dependencies:
```
cd api
python -m venv env
source env/bin/activate  # On Windows use: .\env\Scripts\activate
pip install -r requirements.txt
```

4. Create a .env file in the root directory with your MongoDB connection string:
```bash
MONGO_URI="your_mongodb_connection_string"
FLASK_APP=app.py
FLASK_ENV=development
DB_NAME=your_database_name
```
### Running the Application
1. Start the frontend development server:
```bash
npm run dev
```
2. Start the backend server (in a separate terminal):
```bash
npm run start-api
```
The application will be available at http://localhost:5173

### Project Structure
```bash
SkyGrouper/
├── api/                 # Backend Flask application
├── public/             # Public assets
├── src/
│   ├── components/     # Reusable React components
│   ├── context/        # React context providers
│   ├── pages/          # Page components
│   └── main.tsx        # Application entry point
├── package.json
└── README.md
```

### License
This project is licensed under the MIT License - see the LICENSE file for details

