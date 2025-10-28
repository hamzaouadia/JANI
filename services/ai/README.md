# AI Service# AI Service# AI Service



> **Machine learning and AI integrations (placeholder service)**



The AI Service is a placeholder service for future ML/AI features including crop recommendations, yield predictions, pest detection, and market intelligence.> **Machine learning and AI integrations (placeholder)**The AI service is a minimal Express placeholder that keeps an endpoint available while the platform’s machine-learning features are being designed. It exposes a single health route and is wired for JSON payloads so future endpoints can land without extra setup.



## 📋 Overview



- **Type**: JavaScript Express Service (ES Modules)The AI Service is a placeholder for future ML/AI features including crop recommendations, yield predictions, and image recognition.## Capabilities

- **Port**: 5001 (default)

- **Status**: Placeholder / Development

- **Package Manager**: npm

## 📋 Overview- `/health` returns service metadata, uptime, and a note explaining that the implementation is a stub.

## 🎯 Planned Features

- JSON body parsing is already enabled for incoming requests.

1. **Crop Recommendations**

   - ML-based crop selection- **Type**: JavaScript Express Service- Port selection happens through `PORT`, making the service deployable both locally and inside Docker Compose.

   - Soil analysis integration

   - Climate data correlation- **Port**: 5001 (default)

   - Historical yield analysis

- **Package Manager**: npm## Project Layout

2. **Yield Prediction**

   - Machine learning models- **Status**: Placeholder / Development

   - Weather pattern analysis

   - Historical data trends```

   - Production forecasting

## 🎯 Planned Featuresserver.js        # Express bootstrap and health endpoint

3. **Pest & Disease Detection**

   - Image recognition.env.example     # Sample environment configuration

   - Computer vision analysis

   - Early warning systems1. **Crop Recommendations**Dockerfile       # Minimal container build

   - Treatment recommendations

   - ML-based crop suggestionspackage.json     # Scripts and dependencies (Express only)

4. **Market Intelligence**

   - Price forecasting   - Soil analysis```

   - Demand prediction

   - Market trend analysis   - Climate data integration

   - Optimal selling time suggestions

## Environment

5. **Resource Optimization**

   - Water usage optimization2. **Yield Prediction**

   - Fertilizer efficiency

   - Labor allocation   - Historical data analysis| Variable | Purpose | Default |

   - Cost reduction strategies

   - Weather correlation| --- | --- | --- |

## 🚀 Quick Start

   - Production forecasting| `PORT` | HTTP port exposed by the service | `5001` |

```bash

cd services/ai| `NODE_ENV` | Future toggle for logging or feature flags | `development` |

npm install

npm start3. **Image Recognition**| `AI_SERVICE_URL` | Optional URL other services can reference | `http://localhost:4003` |

```

   - Pest detection| `OPENAI_API_KEY` | Placeholder credential for upcoming integrations | _(unset)_ |

### Environment Variables

   - Disease identification

```bash

PORT=5001   - Crop health assessmentCopy `.env.example` to `.env` (or export equivalent variables) before running locally.

NODE_ENV=development



# Future AI integrations

OPENAI_API_KEY=your-openai-key4. **Market Intelligence**## Local Development

GEMINI_API_KEY=your-gemini-key

WEATHER_API_KEY=your-weather-api-key   - Price forecasting

MARKET_DATA_API_KEY=your-market-data-key

```   - Demand prediction```bash



## 📡 API Reference   - Market trendscd services/ai



### Base URLpnpm install

```

http://localhost:5001## 🚀 Quick Startpnpm start

```

```

### Current Endpoints

```bash

#### Health Check

```httpcd services/aiOn startup you should see `AI service listening on <port>` in the terminal.

GET /health

```npm install



**Response:**npm start### Verify

```json

{```

  "service": "JANI AI Service",

  "status": "healthy",```bash

  "timestamp": "2025-10-28T10:30:00.000Z",

  "version": "1.0.0",### Environment Variablescurl http://localhost:5001/health

  "uptime": 3600.5,

  "note": "Placeholder service - AI integration pending"```

}

``````bash



## 🔮 Future API EndpointsPORT=5001Expected response:



### Crop RecommendationsOPENAI_API_KEY=your-openai-key  # Optional



```http``````json

POST /api/ai/crop-recommendations

Content-Type: application/json{



{## 📡 API Reference  "service": "JANI AI Service",

  "farmId": "farm_123",

  "soilType": "loamy",  "status": "healthy",

  "climate": "temperate",

  "previousCrops": ["tomatoes", "lettuce"],### Base URL  "timestamp": "2025-10-27T12:00:00.000Z",

  "season": "spring",

  "location": {```  "version": "1.0.0",

    "latitude": 37.7749,

    "longitude": -122.4194http://localhost:5001  "uptime": 1.23,

  }

}```  "note": "Placeholder service - AI integration pending"

```

}

**Expected Response:**

```json### Current Endpoints```

{

  "recommendations": [

    {

      "crop": "beans",```http## Docker

      "confidence": 0.92,

      "expectedYield": "2500 kg/hectare",GET  /health              # Health check

      "rotationBenefit": "nitrogen fixation",

      "marketDemand": "high",POST /api/analyze         # Placeholder for AI analysis```bash

      "waterRequirement": "medium"

    },```cd services/ai

    {

      "crop": "carrots",docker build -t jani-ai-service .

      "confidence": 0.87,

      "expectedYield": "3000 kg/hectare",### Example Requestdocker run --rm -p 5001:5001 jani-ai-service

      "rotationBenefit": "good succession crop",

      "marketDemand": "medium",```

      "waterRequirement": "low"

    }```http

  ],

  "model": "crop-recommendation-v1",GET /healthDocker Compose users can rely on the `ai` service declared at the repository root; it maps the port based on `.env` just like local runs.

  "timestamp": "2025-10-28T10:30:00.000Z"

}```

```

## Next Steps

### Yield Prediction

**Response:**

```http

POST /api/ai/yield-prediction```json- Add authentication once real AI endpoints are available.

Content-Type: application/json

{- Introduce structured logging and metrics before exposing inference workloads.

{

  "farmId": "farm_123",  "status": "healthy",- Replace the placeholder health note with real capability information when integrations land.

  "fieldId": "field_456",

  "crop": "tomatoes",  "service": "ai",

  "plantingDate": "2025-10-01",  "version": "1.0.0",

  "area": 5,  "message": "AI service placeholder - ready for integration"

  "areaUnit": "hectares",}

  "historicalData": {...},```

  "weatherForecast": {...}

}## 🔮 Future Integration

```

This service is designed to integrate with:

**Expected Response:**- OpenAI GPT models

```json- TensorFlow.js

{- Computer vision APIs

  "predictedYield": {- Weather APIs

    "amount": 12500,- Market data providers

    "unit": "kg",

    "confidence": 0.85## 🚀 Deployment

  },

  "harvestDate": "2025-12-15",```bash

  "factors": [docker build -t jani-ai .

    {docker run -p 5001:5001 jani-ai

      "factor": "weather",```

      "impact": 0.15,

      "description": "Favorable conditions expected"---

    },

    {**Built with Express - Ready for AI Integration**

      "factor": "soil_quality",
      "impact": 0.25,
      "description": "Excellent soil composition"
    }
  ],
  "recommendations": [
    "Increase irrigation by 10% in week 8",
    "Apply fertilizer on week 6"
  ]
}
```

### Pest Detection

```http
POST /api/ai/pest-detection
Content-Type: multipart/form-data

image: [plant photo file]
farmId: farm_123
crop: tomatoes
```

**Expected Response:**
```json
{
  "detections": [
    {
      "pest": "aphids",
      "confidence": 0.94,
      "severity": "moderate",
      "location": {
        "bbox": [100, 150, 300, 400]
      },
      "treatment": {
        "method": "organic insecticidal soap",
        "application": "spray affected areas",
        "frequency": "every 3 days",
        "duration": "2 weeks"
      }
    }
  ],
  "healthScore": 0.72,
  "model": "pest-detection-v2"
}
```

### Market Intelligence

```http
POST /api/ai/market-forecast
Content-Type: application/json

{
  "crop": "tomatoes",
  "region": "california",
  "quantity": 2500,
  "unit": "kg",
  "timeframe": "next-30-days"
}
```

**Expected Response:**
```json
{
  "forecast": {
    "currentPrice": 2.5,
    "predictedPrice": 2.8,
    "priceChange": "+12%",
    "optimalSellDate": "2025-11-05",
    "confidence": 0.78
  },
  "marketTrends": [
    {
      "date": "2025-11-05",
      "predictedPrice": 2.8,
      "demand": "high"
    },
    {
      "date": "2025-11-12",
      "predictedPrice": 2.6,
      "demand": "medium"
    }
  ],
  "insights": [
    "Peak demand expected in early November",
    "Consider storage for better pricing"
  ]
}
```

## 🤖 Planned Integrations

### OpenAI / GPT Models
- Natural language queries
- Agricultural advice chatbot
- Document analysis
- Report generation

### Computer Vision
- TensorFlow.js for browser-based ML
- Plant disease recognition
- Crop health monitoring
- Weed detection

### Weather APIs
- Historical weather data
- Long-term forecasts
- Climate pattern analysis
- Frost warnings

### Market Data Providers
- Real-time commodity prices
- Supply/demand analytics
- Regional market trends
- Export opportunities

### IoT Sensor Integration
- Soil moisture sensors
- Temperature monitoring
- Humidity tracking
- Automated irrigation control

## 🏗️ Future Architecture

```
┌─────────────────────────────────────────┐
│          AI Service (5001)              │
├─────────────────────────────────────────┤
│                                         │
│  /api/ai/crop-recommendations           │
│  /api/ai/yield-prediction               │
│  /api/ai/pest-detection                 │
│  /api/ai/market-forecast                │
│  /api/ai/resource-optimization          │
│  /api/ai/chat                           │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────┐  ┌──────────┐  ┌───────┐│
│  │ OpenAI   │  │TensorFlow│  │Weather││
│  │   API    │  │  Models  │  │  API  ││
│  └──────────┘  └──────────┘  └───────┘│
│                                         │
│  ┌──────────┐  ┌──────────┐           │
│  │ Market   │  │   IoT    │           │
│  │  Data    │  │ Sensors  │           │
│  └──────────┘  └──────────┘           │
└─────────────────────────────────────────┘
```

## 📊 ML Model Pipeline (Planned)

1. **Data Collection**
   - Farm historical data
   - Weather patterns
   - Soil analysis
   - Market prices

2. **Preprocessing**
   - Data cleaning
   - Feature engineering
   - Normalization
   - Augmentation

3. **Model Training**
   - Supervised learning
   - Neural networks
   - Random forests
   - Time series models

4. **Deployment**
   - Model versioning
   - A/B testing
   - Performance monitoring
   - Continuous learning

## 🚀 Deployment

### Docker

```bash
docker build -t jani-ai .
docker run -p 5001:5001 \
  -e OPENAI_API_KEY=your-key \
  jani-ai
```

### Docker Compose

```yaml
ai:
  build: ./services/ai
  ports:
    - "5001:5001"
  environment:
    - OPENAI_API_KEY=${OPENAI_API_KEY}
    - NODE_ENV=production
```

## 🛠️ Development Roadmap

### Phase 1: Foundation (Current)
- ✅ Basic service setup
- ✅ Health check endpoint
- ⏳ API structure definition

### Phase 2: Crop Intelligence
- ⏳ Crop recommendation engine
- ⏳ Yield prediction models
- ⏳ Historical data analysis

### Phase 3: Computer Vision
- ⏳ Image classification setup
- ⏳ Pest detection models
- ⏳ Disease identification

### Phase 4: Market Intelligence
- ⏳ Price forecasting
- ⏳ Demand prediction
- ⏳ Market trend analysis

### Phase 5: Advanced Features
- ⏳ Chatbot integration
- ⏳ IoT sensor integration
- ⏳ Real-time recommendations
- ⏳ Automated decision making

## 📝 Contributing

This service is ready for AI/ML integration. Contributions welcome!

### Integration Steps

1. Choose an AI feature to implement
2. Add required dependencies
3. Create API endpoints
4. Implement ML models or API integrations
5. Add tests
6. Update documentation

---

**Built with Express - Ready for AI Integration**
