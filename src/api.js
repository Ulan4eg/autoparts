const API_URL = '/api/hs/hsprice/';
const API_KEY = import.meta.env.VITE_API_KEY;

// Один запрос к веб-сервису «Проценка».
// URLSearchParams сам экранирует спецсимволы (#, & и т.д.)
export async function fetchPrices(params) {
  const query = new URLSearchParams({ key: API_KEY, info: 'on', ...params });

  let response;
  try {
    response = await fetch(`${API_URL}?${query}`);
  } catch {
    throw new Error('Не удалось связаться с сервером. Проверьте подключение к сети.');
  }
  if (!response.ok) {
    throw new Error(`Сервер вернул ошибку ${response.status}.`);
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error('Сервер вернул некорректный ответ.');
  }

  // Ошибка API: {"error": "..."}
  if (data.error) {
    throw new Error(Array.isArray(data.error) ? data.error.join(', ') : String(data.error));
  }
  return Array.isArray(data.goods) ? data.goods : [];
}
