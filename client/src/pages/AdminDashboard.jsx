
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Line, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    BarElement,
    Legend,
} from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, BarElement, Legend);

const AdminDashboard = () => {
    const [trending, setTrending] = useState([]);
    const [dailyViews, setDailyViews] = useState([]);
    const [viewsByCategory, setViewsByCategory] = useState([]);
    const [articlesByDay, setArticlesByDay] = useState([]);
    const [loading, setLoading] = useState(true);
    const [range, setRange] = useState(7); // 7 or 30 days

    useEffect(() => {
        const fetchTrending = async () => {
            try {
                const res = await axios.get('/api/articles/trending/top5');
                setTrending(res.data);
            } catch (err) {
                console.error("Error fetching trending:", err);
            }
        };

        const fetchViewData = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`/api/analytics/views-by-day?range=${range}`);
                setDailyViews(res.data);
            } catch (err) {
                console.error("Error fetching view data:", err);
            } finally {
                setLoading(false);
            }
        };

        const fetchViewsByCategory = async () => {
            try {
                const res = await axios.get('/api/analytics/views-by-category');
                setViewsByCategory(res.data);
            } catch (err) {
                console.error("Error fetching category views:", err);
            }
        };

        const fetchArticlesByDay = async () => {
            try {
                const res = await axios.get(`/api/analytics/articles-by-day?range=${range}`);
                setArticlesByDay(res.data);
            } catch (err) {
                console.error("Error fetching articles by day:", err);
            }
        };

        fetchTrending();
        fetchViewData();
        fetchViewsByCategory();
        fetchArticlesByDay();
    }, [range]);

    const lineChartData = {
        labels: dailyViews.map((d) => new Date(d._id).toLocaleDateString()),
        datasets: [
            {
                label: 'Article Views',
                data: dailyViews.map((d) => d.totalViews),
                fill: false,
                borderColor: '#3b82f6',
                tension: 0.4,
            },
        ],
    };

    const barChartData = {
        labels: viewsByCategory.map(c => c._id),
        datasets: [
            {
                label: "Views by Category",
                data: viewsByCategory.map(c => c.totalViews),
                backgroundColor: "#60a5fa"
            }
        ]
    };

    const articlesByDayChart = {
        labels: articlesByDay.map(d => new Date(d._id).toLocaleDateString()),
        datasets: [
            {
                label: "Articles Posted",
                data: articlesByDay.map(d => d.count),
                backgroundColor: "#34d399",
            }
        ]
    };

    if (loading) {
        return (
            <div className="text-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">📊 Admin Analytics Dashboard</h1>

            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-3">Top 5 Trending Articles</h2>
                <ul className="space-y-2">
                    {trending.map((article, i) => (
                        <li key={article._id} className="border p-3 rounded-md  shadow">
                            <strong>#{i + 1}</strong> {article.title} — {article.views} views
                        </li>
                    ))}
                </ul>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-3">Views Over Time</h2>
                <div className="flex justify-end mb-4">
                    <select
                        className="border rounded p-2"
                        value={range}
                        onChange={(e) => setRange(parseInt(e.target.value))}
                    >
                        <option value={7}>Last 7 Days</option>
                        <option value={30}>Last 30 Days</option>
                    </select>
                </div>
                <div className="bg-white p-4 rounded shadow">
                    <Line data={lineChartData} />
                </div>
            </div>

            <div className="mt-10">
                <h2 className="text-xl font-semibold mb-3">Views by Category</h2>
                <div className="bg-white p-4 rounded shadow">
                    <Bar data={barChartData} />
                </div>
            </div>

            <div className="mt-10">
                <h2 className="text-xl font-semibold mb-3">Articles Posted Over Time</h2>
                <div className="bg-white p-4 rounded shadow">
                    <Bar data={articlesByDayChart} />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
