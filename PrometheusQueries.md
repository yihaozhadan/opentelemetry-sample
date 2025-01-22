# Prometheus Sample Queries

## Basic HTTP Metrics

Request Rate (requests per second)

```
rate(demo_http_server_duration_milliseconds_count[5m])
```

Request Rate by Method

```
rate(demo_http_server_duration_milliseconds_count{method="GET"}[5m])
rate(demo_http_server_duration_milliseconds_count{method="POST"}[5m])
```

Request Rate by Route

```
rate(demo_http_server_duration_milliseconds_count{route=~"/users/.*-.*"}[5m])
```

Error Rate (status code >= 400)

```
sum(rate(demo_http_server_duration_milliseconds_count{status_code=~"4.*|5.*"}[5m])) 
  / 
sum(rate(demo_http_server_duration_milliseconds_count[5m])) * 100
```

## Response Time Metrics

Average Response Time (in ms)

```
rate(demo_http_server_duration_milliseconds_sum[5m]) / rate(demo_http_server_duration_milliseconds_count[5m])
```

Average Response Time by Route

```
rate(demo_http_server_duration_milliseconds_sum{route=~"/users/.*-.*"}[5m]) 
  / 
rate(demo_http_server_duration_milliseconds_count{route=~"/users/.*-.*"}[5m])
```

95th Percentile Response Time

```
histogram_quantile(0.95, sum(rate(demo_http_server_duration_milliseconds_bucket[5m])) by (le))
```

95th Percentile by Route

```
histogram_quantile(0.95, 
  sum(rate(demo_http_server_duration_milliseconds_bucket{route=~"/users/.*-.*"}[5m])) by (le)
)
```

## Response Time Distribution

Median (50th percentile)

```
histogram_quantile(0.50, sum(rate(demo_http_server_duration_milliseconds_bucket[5m])) by (le))
```

75th percentile

```
histogram_quantile(0.75, sum(rate(demo_http_server_duration_milliseconds_bucket[5m])) by (le))
```

99th percentile

```
histogram_quantile(0.99, sum(rate(demo_http_server_duration_milliseconds_bucket[5m])) by (le))
```

## Error Analysis

Error Count by Status Code
```
sum(rate(demo_http_server_duration_milliseconds_count{status_code=~"5.*"}[5m])) by (status_code)
```

Error Rate by Route
```
sum(rate(demo_http_server_duration_milliseconds_count{status_code=~"5.*"}[5m])) by (route)
  / 
sum(rate(demo_http_server_duration_milliseconds_count[5m])) by (route) * 100
```

## Traffic Pattern Analysis

Request Rate by Hour (last 24h)
```
rate(demo_http_server_duration_milliseconds_count[1h]) * 3600
```

Busy Routes (top 5 by request count)
```
topk(5, sum(rate(demo_http_server_duration_milliseconds_count[5m])) by (route))
```

Slow Routes (top 5 by average response time)
```
topk(5, 
  rate(demo_http_server_duration_milliseconds_sum[5m]) 
  / 
  rate(demo_http_server_duration_milliseconds_count[5m])
)
```

## SLA/SLO Queries

Percentage of requests under 500ms
```
sum(rate(demo_http_server_duration_milliseconds_bucket{le="500"}[5m])) 
  / 
sum(rate(demo_http_server_duration_milliseconds_count[5m])) * 100
```

Success Rate (status code < 400)
```
sum(rate(demo_http_server_duration_milliseconds_count{status_code=~"2.*|3.*"}[5m])) 
  / 
sum(rate(demo_http_server_duration_milliseconds_count[5m])) * 100
```

Apdex Score (Target: 300ms)
```
(
  sum(rate(demo_http_server_duration_milliseconds_bucket{le="300"}[5m])) +
  sum(rate(demo_http_server_duration_milliseconds_bucket{le="1200"}[5m])) -
  sum(rate(demo_http_server_duration_milliseconds_bucket{le="300"}[5m]))
) / (2 * sum(rate(demo_http_server_duration_milliseconds_count[5m])))
```