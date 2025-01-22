Start the services:
```bash
docker compose up -d
```

The services will be available at:

Jaeger UI: http://localhost:16686
OpenTelemetry Collector endpoint: http://localhost:4318

The Node.js application is configured to send data to the collector at port 4318.

The setup includes:

Jaeger all-in-one image that includes the collector, query service, and UI OpenTelemetry Collector configured to:

- Receive OTLP over HTTP
- Batch process the traces
- Export to Jaeger
- Include debug logging

Once everything is running, you can:

1. Run your Node.js application
2. Make some HTTP requests to your endpoints
3. Visit the Jaeger UI at http://localhost:16686 to see your traces
