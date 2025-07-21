import { Link, useSearchParams } from 'react-router-dom';

const Navbar = () => {
    const categories = ['All', 'NBA', 'F1', 'Cricket', 'Football', 'WWE', 'Esports'];
    const [searchParams, setSearchParams] = useSearchParams();
    const currentCategory = searchParams.get('category') || 'All';

    const handleCategoryClick = (cat) => {
        const params = {};
        if (cat !== 'All') params.category = cat;
        params.page = 1; // reset to first page on category click
        setSearchParams(params);
    };

    return (
        <nav className="bg-black text-white py-3 px-6 shadow-md">
            <div className="flex justify-between items-center max-w-7xl mx-auto">
                <Link to="/" className="text-2xl font-bold tracking-wide text-yellow-400">
                    🏀 Sportify
                </Link>

                <ul className="flex gap-4 text-sm md:text-base">
                    {categories.map((cat) => (
                        <li key={cat}>
                            <button
                                onClick={() => handleCategoryClick(cat)}
                                className={`hover:text-yellow-300 ${currentCategory === cat ? 'text-yellow-400 underline' : ''
                                    }`}
                            >
                                {cat}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
