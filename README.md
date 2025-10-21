# Roadmap AI

Roadmap AI is a web application that generates actionable project roadmaps using AI. Users can create goals, generate structured roadmaps in JSON format, and track them via a responsive dashboard.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup & Installation](#setup--installation)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- Generate structured, actionable roadmaps with AI.
- Limit user access to a certain number of roadmap generations.
- View all roadmaps or personal roadmaps.
- Responsive dashboard with skeleton loaders for improved UX.
- Error handling for AI generation failures.
- JSON-only roadmap output ensuring consistent structure.

---

## Tech Stack

- **Frontend:** Next.js, React, TailwindCSS
- **Backend:** FastAPI, Python 3.11
- **Database:** PostgreSQL, SQLAlchemy, Alembic
- **AI Integration:** Google Gemini API (`genai`)
- **Authentication:** Bearer Token (Google ID)
- **Deployment:** Vercel / Any cloud provider

---

## Setup & Installation

### Prerequisites

- Python 3.11+
- Node.js 20+
- PostgreSQL

### Backend

1. Clone the repository:

```bash
git clone https://github.com/raghulkannan-s/roadmapAI.git
cd roadmap-ai/backend
```

2. Create a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Set environment variables in `.env`:

```
DB_URI=postgresql://user:password@localhost:5432/roadmap_db
GOOGLE_API_KEY=your_google_api_key
FRONTEND_URL=http://localhost:3000
```

5. Run migrations:

```bash
alembic upgrade head
```

6. Start backend server:

```bash
uvicorn app.server:app --reload
```

### Frontend

1. Navigate to frontend:

```bash
cd ../frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view in browser.

---

## Usage

* **Generate Roadmap:** Fill goal, description, and timeframe → AI generates JSON roadmap → saved in database.
* **Dashboard:** Displays user's roadmaps in grid with skeleton loaders during loading.
* **View Details:** Click on a roadmap to see full details.

---

## API Reference

### Roadmap Routes

| Endpoint            | Method | Description           |
| ------------------- | ------ | --------------------- |
| `/roadmap/`         | GET    | Health check          |
| `/roadmap/get/all`  | GET    | Fetch all roadmaps    |
| `/roadmap/get/my`   | GET    | Fetch user's roadmaps |
| `/roadmap/get/{id}` | GET    | Fetch roadmap by ID   |
| `/roadmap/generate` | POST   | Generate new roadmap  |

**Headers:**

* `Authorization: Bearer <google_id>`

**POST `/roadmap/generate` Body:**

```json
{
  "prompt": "Learn Full-Stack Web Development"
}
```

**Response Schema:** JSON containing `roadmap_json` with segments, tasks, durations, and meta info.

---

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "Add new feature"`
4. Push to branch: `git push origin feature/my-feature`
5. Create a pull request.

---

## License

This project is licensed under the MIT License.
