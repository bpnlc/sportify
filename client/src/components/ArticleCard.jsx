import { Link } from 'react-router-dom';

const ArticleCard = ({ article }) => {
    return (
        <div className="border rounded-xl p-4 shadow-md hover:shadow-xl transition bg-white">
            <img src={article.image} alt={article.title} className="rounded-md w-full h-40 object-cover mb-3" />
            <h2 className="text-lg font-semibold">{article.title}</h2>
            <p className="text-sm text-gray-500">{article.category} • {new Date(article.createdAt).toLocaleDateString()}</p>
            <Link to={`/article/${article._id}`} className="text-blue-600 mt-2 inline-block">Read more →</Link>
        </div>
    );
};

export default ArticleCard;
