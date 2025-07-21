import { Link } from 'react-router-dom';

const Footer = () => (
    <footer className="bg-black text-white py-4 mt-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-4 flex-col sm:flex-row gap-2 sm:gap-0">
            <p className="text-sm">&copy; {new Date().getFullYear()} SportzBlog</p>
            <div className="flex gap-4 text-sm">
                <Link to="/about" className="hover:text-yellow-400">About</Link>
                <Link to="/contact" className="hover:text-yellow-400">Contact</Link>
                <Link to="/privacy" className="hover:text-yellow-400">Privacy</Link>
            </div>
        </div>
    </footer>
);

export default Footer;
