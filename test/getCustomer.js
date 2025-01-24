/**
 * This script performs a GET request to the target URL and logs the response status code.
 * Run this script using "k6 run getCustomer.js".
 */
import http from 'k6/http';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';
import { sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 5 },   // Ramp up to 5 users over 30 seconds
    { duration: '1m', target: 5 },    // Stay at 5 users for 1 minute
    { duration: '30s', target: 10 },  // Ramp up to 10 users over 30 seconds
    { duration: '1m', target: 10 },   // Stay at 10 users for 1 minute
    { duration: '30s', target: 0 },   // Ramp down to 0 users
  ],
};

// The default exported function is gonna be picked up by k6 as the entry point for the test script
export default function () {
  const userId = uuidv4();
  // Make a GET request to the target URL
  http.get(`http://localhost:3000/users/${userId}`);
  // Add a small sleep to make the test more realistic
  sleep(1);
}