const films = axios.create({
  baseURL: `https://tmdb-proxy.cubos-academy.workers.dev/3/`,
  timeout: 10000,
  headers: { "Content-Type": "aplication/json" },
});
