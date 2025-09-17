'use client';

import { useEffect, useState } from 'react';

export default function News() {
  const [news, setNews] = useState([]);
  const [articleNumber, setArticleNumber] = useState(3);

  useEffect(() => {
    async function getNews() {
      const result = await fetch(
        'https://saurav.tech/NewsAPI/top-headlines/category/business/us.json',
      );
      const resultJSON = await result.json();
      setNews(resultJSON.articles);
    }

    getNews();
  }, []);
  return (
    <section className="space-y-3 rounded-xl bg-gray-100 pt-2 text-gray-700">
      <h1 className="px-3 text-xl font-bold">What's happening</h1>
      <ul>
        {news.slice(0, articleNumber).map((article: any) => (
          <li key={article.url}>
            <article>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between space-x-1 px-2 py-2 transition duration-200 hover:bg-gray-200"
              >
                <div className="space-y-0.5">
                  <h2 className="text-sm font-bold">{article.title}</h2>
                  <p className="text-xs font-medium text-gray-500">
                    {article.source.name}
                  </p>
                </div>
                <img
                  src={article.urlToImage}
                  alt="Article image"
                  width={70}
                  className="rounded-xl"
                />
              </a>
            </article>
          </li>
        ))}
      </ul>
      <button
        onClick={() => setArticleNumber(articleNumber + 3)}
        className="pb-3 pl-4 text-sm text-blue-300 hover:text-blue-400"
      >
        Load more
      </button>
    </section>
  );
}
