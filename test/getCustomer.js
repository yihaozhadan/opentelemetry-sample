/**
 * This script performs a GET request to the target URL and logs the response status code.
 * Run this script using "k6 run getCustomer.js".
 */
import http from 'k6/http';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';

export const options = {
  iterations: 10,
};

// The default exported function is gonna be picked up by k6 as the entry point for the test script. It will be executed repeatedly in "iterations" for the whole duration of the test.
export default function () {
  const userId = uuidv4();
  console.log(`User ID: ${userId}`);
  // Make a GET request to the target URL
  http.get(`http://localhost:3000/users/${userId}`);
}