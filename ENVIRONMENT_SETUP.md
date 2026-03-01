# Environment Setup Instructions

## Prerequisites

### Required Software

1. **Node.js & npm**
   - Download: https://nodejs.org (LTS recommended)
   - Verify: `node --version` and `npm --version`
   - Required: Node v14+ and npm v6+

2. **PostgreSQL Database**
   - Option A: Neon (Cloud) - https://neon.tech (RECOMMENDED)
   - Option B: Local PostgreSQL - https://postgresql.org

3. **Code Editor**
   - VS Code (recommended) - https://code.visualstudio.com
   - Or any preferred IDE

4. **Git** (Optional, for version control)
   - Download: https://git-scm.com

---

## Database Setup

### Option 1: Neon Cloud Database (Recommended for beginners)

**Advantages:**
- No installation needed
- Free tier included
- Automatic backups
- Secure connection

**Steps:**

1. Visit https://neon.tech and sign up
2. Create a new project
3. Copy the connection string (looks like):
   ```
   postgresql://user:password@ep-xxx.us-east-1.neon.tech/dbname?sslmode=require
   ```
4. Save it - you'll need it in the next step

### Option 2: Local PostgreSQL Installation

#### Windows
1. Download PostgreSQL installer from https://www.postgresql.org/download/windows/
2. Run installer with default settings
3. Remember the password you set (default user is `postgres`)
4. Open PostgreSQL command line:
   ```bash
   psql -U postgres
   ```
5. Create database:
   ```sql
   CREATE DATABASE architect_db;
   \q
   ```

#### macOS
```bash
# Install via Homebrew
brew install postgresql

# Start PostgreSQL service
brew services start postgresql

# Create database
createdb architect_db

# Connect and verify
psql architect_db
```

#### Linux (Ubuntu/Debian)
```bash
# Install PostgreSQL
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib

# Start service
sudo systemctl start postgresql

# Create database
sudo -u postgres createdb architect_db

# Connect and verify
sudo -u postgres psql architect_db
```

---

## Backend Setup

### Step 1: Navigate to Backend Directory
```bash
cd architect/backend
```

### Step 2: Install Dependencies
```bash
npm install
```

This installs:
- express (web framework)
- pg (database client)
- cors (cross-origin requests)
- dotenv (environment variables)
- express-validator (form validation)

### Step 3: Create Environment File

**Copy the example:**
```bash
cp .env.example .env
```

**Or manually create `.env` file with:**

If using **Neon**:
```
DATABASE_URL=postgresql://user:password@ep-xxx.us-east-1.neon.tech/dbname?sslmode=require
PORT=5000
NODE_ENV=development
```

If using **Local PostgreSQL**:
```
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/architect_db
PORT=5000
NODE_ENV=development
```

Replace:
- `your_password` - The password you set during PostgreSQL installation
- `localhost` - Keep as is for local setup
- `architect_db` - Database name you created

### Step 4: Initialize Database

```bash
npm run migrate
```

This will:
- Create database tables
- Insert sample projects and images

**Expected output:**
```
Database connected successfully
Initializing database...
Database initialized successfully
Sample data inserted successfully
```

### Step 5: Start Backend Server

```bash
# Development mode (auto-reload on file changes)
npm run dev

# Production mode
npm start
```

**Expected output:**
```
Server running on port 5000
Environment: development
Database connected successfully
```

✅ Backend is ready at http://localhost:5000

---

## Frontend Setup

### Step 1: Navigate to Frontend Directory
```bash
cd architect/frontend
```

### Step 2: Install Dependencies
```bash
npm install
```

This installs:
- react & react-dom (UI library)
- axios (API client)
- react-scripts (build tools)

### Step 3: Create Environment File (Optional)

Create `.env` file if using different backend URL:
```
REACT_APP_API_URL=http://localhost:5000
```

**Default:** Already configured to use `http://localhost:5000`

### Step 4: Start Frontend Dev Server

```bash
npm start
```

This will:
- Bundle your React code
- Start dev server on port 3000
- Open http://localhost:3000 in your browser
- Enable hot reload (auto-refresh on file changes)

**Expected output:**
```
Compiled successfully!
You can now view architect-portfolio-frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

✅ Frontend is ready at http://localhost:3000

---

## Full System Running

### In Terminal 1 (Backend):
```bash
cd architect/backend
npm run dev
# Should show: Server running on port 5000
```

### In Terminal 2 (Frontend):
```bash
cd architect/frontend
npm start
# Should open browser or show: http://localhost:3000
```

### Test the Connection:

1. Open http://localhost:3000 in browser
2. You should see:
   - Navigation header with "ARCHITECT SILAS"
   - Image carousel with sample images
   - Project grid with sample projects
   - About section
   - Contact form

3. Try submitting contact form
4. Check backend console for confirmation

---

## Environment Variables Explained

### Backend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| DATABASE_URL | PostgreSQL connection string | postgresql://user:pass@host/db |
| PORT | Server port | 5000 |
| NODE_ENV | Environment mode | development / production |

### Frontend (.env)

| Variable | Description | Default |
|----------|-------------|---------|
| REACT_APP_API_URL | Backend API base URL | http://localhost:5000 |

**Note:** React requires `REACT_APP_` prefix for environment variables

---

## Troubleshooting

### Backend Won't Start

**Error: "Port 5000 already in use"**
```bash
# Find and kill process using port 5000
# Windows: 
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -i :5000
kill -9 <PID>
```

**Error: "Cannot connect to database"**
- Check DATABASE_URL is correct
- Verify PostgreSQL is running
- Test connection: `psql <your-connection-string>`

**Error: "ENOENT: no such file or directory, open '.env'"**
- Ensure you created `.env` file
- Check you're in correct directory (/backend)

### Frontend Won't Start

**Error: "Port 3000 already in use"**
```bash
# Kill process on port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -i :3000
kill -9 <PID>
```

**Error: "Module not found"**
- Delete `node_modules` folder
- Delete `package-lock.json`
- Run `npm install` again

**Error: "API calls failing / 404"**
- Ensure backend is running on port 5000
- Check REACT_APP_API_URL in `.env`
- Check browser console for actual error

### Database Issues

**Error: "FATAL: Ident authentication failed"**
- Use correct password in DATABASE_URL
- Make sure password doesn't have special characters (URL encode if needed)

**Error: "Database architect_db does not exist"**
- Run `npm run migrate` to create tables
- Or manually: `createdb architect_db`

---

## Useful Commands

### Backend
```bash
# Start in dev mode (auto-reload)
npm run dev

# Start in production
npm start

# Run migrations (create/update database)
npm run migrate

# Check installed packages
npm list
```

### Frontend
```bash
# Start dev server
npm start

# Build for production
npm run build

# Run tests
npm test

# Check installed packages
npm list
```

### Database (via psql)
```bash
# Connect to local database
psql architect_db

# See all tables
\dt

# See sample projects
SELECT * FROM projects;

# See gallery images
SELECT * FROM gallery_images;

# Exit psql
\q
```

---

## Next: Customization

Once everything is running:

1. **Change Architect Name**
   - Edit `frontend/src/components/Header.js`
   - Edit `frontend/src/components/About.js`

2. **Update Images**
   - Database: `UPDATE gallery_images SET image_url = '...'`
   - Or API: POST to `/api/gallery`

3. **Add Projects**
   - Database: INSERT into projects table
   - Or API: POST to `/api/projects`

4. **Change Colors/Fonts**
   - Edit `frontend/src/styles/global.css`

---

## Support Resources

- **PostgreSQL Docs:** https://www.postgresql.org/docs/
- **Node.js Docs:** https://nodejs.org/docs/
- **React Docs:** https://react.dev
- **Express Docs:** https://expressjs.com
- **Axios Docs:** https://axios-http.com

---

Happy coding! 🚀
