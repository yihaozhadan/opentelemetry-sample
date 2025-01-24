const express = require('express');
const { setupTelemetry, createCustomMetrics } = require('./tracing');
const { trace } = require('@opentelemetry/api');

// Initialize OpenTelemetry
const sdk = setupTelemetry();
const { responseTimeHistogram } = createCustomMetrics();

const app = express();
const PORT = 3000;

// Middleware to track response time
app.use((req, res, next) => {
    const startTime = Date.now();
    
    // Add listener for when response finishes
    res.on('finish', () => {
        const duration = Date.now() - startTime;
        responseTimeHistogram.record(duration, {
            route: req.path,
            method: req.method,
            status_code: res.statusCode.toString()
        });
    });

    const span = trace.getActiveSpan();
    if (span) {
        span.setAttribute('http.user_agent', req.headers['user-agent']);
        span.setAttribute('custom.request_id', Math.random().toString(36).substring(7));
    }
    next();
});

// Example route with custom span and simulated delay
app.get('/users/:id', async (req, res) => {
    const tracer = trace.getTracer('example-http-service');
    
    await tracer.startActiveSpan('fetch-user-details', async (span) => {
        try {
            // Simulate random response time between 100-500ms
            const delay = Math.floor(Math.random() * 400) + 100;
            await new Promise(resolve => setTimeout(resolve, delay));
            
            span.setAttribute('user.id', req.params.id);
            
            res.json({ id: req.params.id, name: 'John Doe', responseTime: delay });
        } catch (error) {
            span.recordException(error);
            span.setStatus({ code: opentelemetry.SpanStatusCode.ERROR });
            res.status(500).json({ error: 'Internal Server Error' });
        } finally {
            span.end();
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
    sdk.shutdown()
        .then(() => console.log('SDK shut down successfully'))
        .catch((error) => console.log('Error shutting down SDK', error))
        .finally(() => process.exit(0));
});