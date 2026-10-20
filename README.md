# Поиск автозапчастей

React + Redux Toolkit + Bootstrap, без TypeScript.

    npm install
    npm run dev

Ключ покупателя — в `.env` (`VITE_API_KEY`).
API отдаётся по http без CORS, поэтому запросы идут через прокси Vite (`/api` -> api.favorit-parts.ru).
Для продакшена нужен такой же прокси на сервере (nginx и т.п.).
