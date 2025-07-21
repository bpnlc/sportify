import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const AdminEditor = ({ onSubmit }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = () => {
        onSubmit({ title, content });
        setTitle('');
        setContent('');
    };

    return (
        <div className="p-4">
            <input
                className="w-full border p-2 mb-4"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Enter title"
            />
            <ReactQuill theme="snow" value={content} onChange={setContent} />
            <button
                className="mt-4 bg-blue-600 text-white px-4 py-2"
                onClick={handleSubmit}
            >
                Publish
            </button>
        </div>
    );
};

export default AdminEditor;
