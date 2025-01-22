# OpenTelemetry Node.js Sample Application

This repository demonstrates how to implement OpenTelemetry instrumentation in a Node.js application with distributed tracing and metrics collection. The setup includes Jaeger for trace visualization and Prometheus for metrics monitoring.

## Components

- **Node.js Application**: A sample application with OpenTelemetry instrumentation
- **OpenTelemetry Collector**: Receives, processes, and exports telemetry data
- **Jaeger**: Distributed tracing system for visualization and analysis
- **Prometheus**: Metrics collection and monitoring

## Prerequisites

- Docker and Docker Compose
- Node.js (v14 or later)
- npm

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Configuration Files

- `docker-compose.yml`: Defines the required services (OpenTelemetry Collector, Jaeger, Prometheus)
- `otel-collector-config.yaml`: OpenTelemetry Collector configuration
- `prometheus.yml`: Prometheus configuration
- `tracing.js`: OpenTelemetry instrumentation setup
- `app.js`: Sample Node.js application

## Running the Application

1. Start the services:
   ```bash
   docker compose up -d
   ```

2. Run the Node.js application:
   ```bash
   node app.js
   ```

## Service Endpoints

- **Jaeger UI**: http://localhost:16686
- **OpenTelemetry Collector**: http://localhost:4318
- **Prometheus**: http://localhost:9090
- **Sample Application**: http://localhost:3000

## Features

- Automatic instrumentation of HTTP requests
- Custom span attributes and events
- Trace context propagation
- Metrics collection and export
- Debug logging in the collector

## Monitoring

1. **View Traces**:
   - Access Jaeger UI at http://localhost:16686
   - Select the service and search for traces

2. **View Metrics**:
   - Access Prometheus UI at http://localhost:9090
   - Use the PrometheusQueries.md file for example queries

## Troubleshooting

If you encounter issues:
1. Check if all containers are running: `docker compose ps`
2. View collector logs: `docker compose logs otel-collector`
3. Ensure all ports are available and not used by other services

## License

This project is open source and available under the MIT license.
