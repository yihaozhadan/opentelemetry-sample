const opentelemetry = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { OTLPMetricExporter } = require('@opentelemetry/exporter-metrics-otlp-http');
const { PeriodicExportingMetricReader } = require('@opentelemetry/sdk-metrics');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
const { MeterProvider } = require('@opentelemetry/sdk-metrics');
const { metrics } = require('@opentelemetry/api');

function setupTelemetry() {
    // Configure the resource with service metadata
    const resource = new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: 'example-http-service',
        [SemanticResourceAttributes.SERVICE_VERSION]: '1.0.0',
    });

    // Create and configure the OpenTelemetry SDK
    const sdk = new opentelemetry.NodeSDK({
        resource: resource,
        traceExporter: new OTLPTraceExporter({
            url: 'http://localhost:8888/v1/traces',
        }),
        metricReader: new PeriodicExportingMetricReader({
            exporter: new OTLPMetricExporter({
                url: 'http://localhost:8888/v1/metrics',
            }),
            exportIntervalMillis: 1000,
        }),
        instrumentations: [
            getNodeAutoInstrumentations({
                '@opentelemetry/instrumentation-http': {
                    enabled: true,
                    ignoreIncomingPaths: ['/health'],
                },
                '@opentelemetry/instrumentation-express': {
                    enabled: true,
                },
            }),
        ],
    });

    // Initialize the SDK
    sdk.start();

    return sdk;
}

// Create custom metrics
function createCustomMetrics() {
    const meter = metrics.getMeter('example-http-service');
    
    const responseTimeHistogram = meter.createHistogram('http_server_duration', {
        description: 'HTTP server response time',
        unit: 'ms',
    });

    return {
        responseTimeHistogram
    };
}

module.exports = { setupTelemetry, createCustomMetrics };