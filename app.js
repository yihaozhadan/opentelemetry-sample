// app.js
const express = require('express');
const { setupTelemetry } = require('./tracing');
const { trace } = require('@opentelemetry/api');

// Initialize OpenTelemetry
setupTelemetry();

const app = express();
const PORT = 3000;

// Middleware to add custom attributes to spans
app.use((req, res, next) => {
    const span = trace.getActiveSpan();
    if (span) {
        span.setAttribute('http.user_agent', req.headers['user-agent']);
        span.setAttribute('custom.request_id', Math.random().toString(36).substring(7));
    }
    next();
});

// Example route with custom span
app.get('/users/:id', async (req, res) => {
    const tracer = trace.getTracer('example-http-service');
    
    // Create a new span for this operation
    await tracer.startActiveSpan('fetch-user-details', async (span) => {
        try {
            // Simulate database lookup
            await new Promise(resolve => setTimeout(resolve, 100));
            
            span.setAttribute('user.id', req.params.id);
            
            // Simulate successful response
            res.json({ id: req.params.id, name: 'John Doe' });
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
