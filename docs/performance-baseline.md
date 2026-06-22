# Performance Baseline

This document defines the baseline performance metrics for the Booking API Frontend application.
These values are used by Lighthouse CI and our automated performance analysis agents to detect regressions.

## Core Web Vitals Baselines

- **LCP (Largest Contentful Paint)**: 2500ms
- **CLS (Cumulative Layout Shift)**: 0.1
- **INP (Interaction to Next Paint)**: 200ms

## Other Lighthouse Metrics

- **First Contentful Paint (FCP)**: 1800ms
- **Speed Index**: 3000ms
- **Total Blocking Time (TBT)**: 200ms

*Note: Any metric degrading by more than 10% from these baseline values in a pull request should trigger an automatic code analysis and create an issue with recommendations for optimization.*
