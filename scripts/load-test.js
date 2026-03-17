// k6 Load Test Script for GaadiBroker
// Install: brew install k6 (or download from https://k6.io)
// Run: k6 run scripts/load-test.js

import http from "k6/http";
import { check, sleep } from "k6";
import { Rate, Trend } from "k6/metrics";

const errorRate = new Rate("errors");
const homepageDuration = new Trend("homepage_duration");
const apiDuration = new Trend("api_duration");

const BASE_URL = __ENV.BASE_URL || "http://localhost:3000";

export const options = {
  stages: [
    { duration: "30s", target: 50 },    // Ramp up to 50 users
    { duration: "1m", target: 100 },    // Ramp up to 100 users
    { duration: "2m", target: 500 },    // Ramp up to 500 users
    { duration: "1m", target: 1000 },   // Peak: 1000 concurrent users
    { duration: "30s", target: 0 },     // Ramp down
  ],
  thresholds: {
    http_req_duration: ["p(95)<2000"],   // 95% of requests < 2s
    errors: ["rate<0.05"],               // Error rate < 5%
    homepage_duration: ["p(95)<3000"],   // Homepage < 3s
    api_duration: ["p(95)<1000"],        // API < 1s
  },
};

export default function () {
  // Test 1: Homepage
  const homeRes = http.get(`${BASE_URL}/`);
  homepageDuration.add(homeRes.timings.duration);
  check(homeRes, {
    "homepage status 200": (r) => r.status === 200,
    "homepage loads fast": (r) => r.timings.duration < 3000,
  });
  errorRate.add(homeRes.status !== 200);

  sleep(1);

  // Test 2: Cars API
  const carsRes = http.get(`${BASE_URL}/api/cars`);
  apiDuration.add(carsRes.timings.duration);
  check(carsRes, {
    "cars API status 200": (r) => r.status === 200,
    "cars API returns array": (r) => {
      try { return Array.isArray(JSON.parse(r.body)); } catch { return false; }
    },
  });
  errorRate.add(carsRes.status !== 200);

  sleep(1);

  // Test 3: Car detail API
  const carRes = http.get(`${BASE_URL}/api/cars/1`);
  apiDuration.add(carRes.timings.duration);
  check(carRes, {
    "car detail responds": (r) => [200, 404].includes(r.status),
  });

  sleep(1);

  // Test 4: Lead submission
  const leadPayload = JSON.stringify({
    name: `LoadTest User ${__VU}`,
    phone: `98765${String(__ITER).padStart(5, "0")}`,
    carId: "1",
    carName: "Test Car",
    source: "load_test",
  });

  const leadRes = http.post(`${BASE_URL}/api/leads`, leadPayload, {
    headers: { "Content-Type": "application/json" },
  });
  check(leadRes, {
    "lead submission responds": (r) => [201, 429].includes(r.status),
  });

  sleep(2);
}

export function handleSummary(data) {
  return {
    stdout: JSON.stringify(data, null, 2),
  };
}
