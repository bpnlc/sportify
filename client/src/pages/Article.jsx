import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';

const Article = () => {
    const { id } = useParams();
    const [article, setArticle] = useState(null);

    useEffect(() => {
        axios.get(`/api/articles/${id}`).then(res => setArticle(res.data));
    }, [id]);

    if (!article) return <div className="p-10">Loading...</div>;

    return (
        <div className="max-w-3xl mx-auto p-6">
            <Helmet>
                <title>{article.title} | 🏀 Sportify</title>
                <meta name="description" content={article.content.slice(0, 150)} />
                <meta property="og:title" content={article.title} />
                <meta property="og:description" content={article.content.slice(0, 150)} />
                <meta property="og:image" content={article.image} />
                <meta property="og:type" content="article" />
            </Helmet>

            <img src={article.image} alt={article.title} className="w-full rounded-xl mb-4" />
            <h1 className="text-3xl font-bold mb-2">{article.title}</h1>
            <p className="text-sm text-gray-500 mb-4">{article.category} • {new Date(article.createdAt).toLocaleDateString()}</p>
            <p className="text-lg">{article.content}</p>
        </div>
    );
};

export default Article;
