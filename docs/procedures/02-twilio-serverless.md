# Twilio Serverless — Local Dev + Deploy

**Install Serverless Plugin**

```bash
twilio plugins:install @twilio-labs/plugin-serverless
```

**Initialize a Functions Project**

```bash
twilio serverless:int whatsapp-backend
cd whatsapp-backend
```

Expected structure:

```text
whatsapp-backend/
  .env
  functions/
    hello-world.js   (sample)
  assets/
  package.json
```

# Run Locally

From your bankend directory:

```bash
cd ~/.../whatsapp-backend
twilio serverless:start
```

Stop:
- `CTRL + C`


# Example Local HTTP Request (Simulate WhatsApp webhook)

```bash
curl -X POST http://localhost:3000/whatsapp-reply \
  -d "Body=get-chemical, inspection" \
  -d "From=whatsapp:+15551234567" \
  -d "To=whatsapp:+1YOURTWILIONUM" \
  -d "ProfileName=Local Test" \
  -d "NumMedia=0"
```

# Deploy

```bash
cd ~/files/whatsapp-backend
twilio serverless:deploy
```
