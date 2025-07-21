import { useEffect, useState } from 'react';
import axios from 'axios';
import ArticleCard from '../components/ArticleCard';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const Home = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = parseInt(searchParams.get('page')) || 1;
    const category = searchParams.get('category') || '';

    const [articles, setArticles] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticles = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`/api/articles?page=${currentPage}&limit=6${category ? `&category=${category}` : ''}`);
                setArticles(res.data.articles);
                setTotalPages(res.data.pages);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchArticles();
    }, [currentPage, searchParams]);


    const handlePageChange = (page) => {
        const category = searchParams.get('category');
        const params = { page };
        if (category) params.category = category;
        setSearchParams(params);
    };


    const featured = articles[0];
    const others = articles.slice(1);

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <Helmet>
                <title>🏀 Sportify | Latest Sports News</title>
                <meta name="description" content="NBA, F1, WWE, Cricket, Football and Esports updates." />
            </Helmet>

            <h1 className="text-3xl font-bold mb-6">🏆 Latest Sports News</h1>
            {loading && <p>Loading...</p>}

            {featured && (
                <div className="mb-10 p-4 bg-yellow-100 rounded-lg shadow-md">
                    <Link to={`/article/${featured._id}`}>
                        <img src={featured.image} alt={featured.title} className="w-full h-64 object-cover rounded mb-3" />
                        <h2 className="text-2xl font-bold">{featured.title}</h2>
                        <p className="text-gray-700 mt-1">{featured.content.slice(0, 120)}...</p>
                    </Link>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {others.map(article => (
                    <ArticleCard key={article._id} article={article} />
                ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center gap-4">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
                >
                    ◀ Previous
                </button>
                <span className="self-center">Page {currentPage} of {totalPages}</span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
                >
                    Next ▶
                </button>
            </div>
        </div>
    );
};

export default Home;
