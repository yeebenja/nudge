# Running Ollama
Run this to run LLM server:
```bash
# Pull the model (one-time)
ollama pull llama3.2:3b

# Start the Ollama server
killall ollama && ollama serve 
```

If you need to test the connection to ollama, you can verify by running this command:
```bash
curl http://localhost:11434/api/tags

```
