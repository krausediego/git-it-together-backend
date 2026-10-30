import axios from 'axios';

export const http = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    'X-GitHub-Api-Version': '2026-03-10',
  },
});
