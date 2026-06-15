# Nudge
I've been with my girlfriend for about 2 years, but we still have those moments where things are hard to talk about. And sometimes one of us doesn't take criticism well.

Enter Nudge, an app where my girlfriend can write down her frustrations about me, and an LLM softens them into gentle, constructive feedback. No difficult conversations needed.

## Running Nudge
### 1. Ollama (local LLM)

```bash
# Pull the model (one-time)
ollama pull llama3.2:3b

# Start the Ollama server
killall ollama && ollama serve 
```

### 2. Backend (Java / Spring Boot)

```bash
cd server

# Enable Ollama integration (edit application.properties or pass as env)
export ollama_enabled=true

# Start the server
./mvnw spring-boot:run
```

The backend starts on `http://localhost:3001`.

### 3. Frontend (React / Vite)

```bash
cd client

# Install dependencies (one-time)
npm install

# Start the dev server
npm run dev
```

The frontend starts on `http://localhost:5173` and proxies API calls to the backend.

Once all three are running, open `http://localhost:5173` in your browser.
