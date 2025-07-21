import toast from 'react-hot-toast';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import Heading from '@tiptap/extension-heading';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';

import {
    FaBold, FaItalic, FaListUl, FaListOl, FaUndo, FaRedo,
    FaHeading, FaImage, FaUnderline
} from 'react-icons/fa';

const CLOUDINARY_UPLOAD_PRESET = 'unsigned_preset';
const CLOUDINARY_CLOUD_NAME = 'dxfysgvqv';

const TiptapEditor = ({ value, onChange }) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                underline: false,
                heading: false,
            })
            ,
            Heading.configure({ levels: [1, 2, 3] }),
            Underline,
            Image,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Placeholder.configure({
                placeholder: 'Write your article content here...',
            }),
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    const handleImageInsert = async () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async () => {
            const file = input.files[0];
            const form = new FormData();
            form.append('file', file);
            form.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

            const res = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, form);
            editor.chain().focus().setImage({ src: res.data.secure_url }).run();
        };
        input.click();
    };

    return (
        <div className="border rounded  p-2 space-y-2">
            {editor && (
                <div className="flex flex-wrap gap-2 mb-2">
                    <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'bg-blue-200 p-1' : 'p-1'}>
                        <FaBold />
                    </button>
                    <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'bg-blue-200 p-1' : 'p-1'}>
                        <FaItalic />
                    </button>
                    <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={editor.isActive('underline') ? 'bg-blue-200 p-1' : 'p-1'}>
                        <FaUnderline />
                    </button>
                    <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'bg-blue-200 p-1' : 'p-1'}>
                        <FaListUl />
                    </button>
                    <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'bg-blue-200 p-1' : 'p-1'}>
                        <FaListOl />
                    </button>
                    <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'bg-blue-200 p-1' : 'p-1'}>
                        <FaHeading />
                    </button>
                    <button type="button" onClick={handleImageInsert} className="p-1">
                        <FaImage />
                    </button>
                    <button type="button" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} className="p-1">
                        <FaUndo />
                    </button>
                    <button type="button" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} className="p-1">
                        <FaRedo />
                    </button>
                </div>
            )}
            <EditorContent editor={editor} className="min-h-[200px]" />
        </div>
    );
};

const Admin = () => {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        image: '',
        category: '',
        tags: ''
    });
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) navigate('/login');
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const form = new FormData();
        form.append('file', file);
        form.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

        try {
            const res = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, form);
            setFormData(prev => ({ ...prev, image: res.data.secure_url }));
        } catch (err) {
            setError('Image upload failed.');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccess(false);
        setError('');

        const { title, content, category } = formData;
        if (!title.trim() || !content.trim() || !category.trim()) {
            toast.error('Please fill in title, content, and category.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Not authenticated');
                navigate('/login');
                return;
            }

            const payload = {
                ...formData,
                tags: formData.tags.split(',').map(tag => tag.trim())
            };

            toast.loading('Posting article...');
            await axios.post('/api/articles', payload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            toast.dismiss(); // remove loading toast
            toast.success('✅ Article posted successfully!');

            setFormData({
                title: '',
                content: '',
                image: '',
                category: '',
                tags: ''
            });
        } catch (err) {
            toast.dismiss();
            toast.error('Failed to post article');
            console.error('Error:', err.response?.data || err.message);
        }

    };


    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">📝 Post a New Article</h1>
            {success && <p className="text-green-600 mb-4">✅ Article posted successfully!</p>}
            {error && <p className="text-red-600 mb-4">❌ {error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" className="w-full p-2 border rounded" />

                <div>
                    <label htmlFor="imageUpload" className="block mb-1 font-medium">Upload Image:</label>
                    <input type="file" id="imageUpload" onChange={handleImageUpload} className="w-full" />
                    {uploading && <p className="text-gray-500">Uploading image...</p>}
                    {formData.image && (
                        <img src={formData.image} alt="preview" className="mt-2 w-full rounded" />
                    )}
                </div>

                <input name="category" value={formData.category} onChange={handleChange} placeholder="Category (e.g., NBA, F1)" className="w-full p-2 border rounded" />
                <input name="tags" value={formData.tags} onChange={handleChange} placeholder="Tags (comma separated)" className="w-full p-2 border rounded" />

                <div>
                    <label className="block mb-1 font-medium">Content:</label>
                    <TiptapEditor
                        value={formData.content}
                        onChange={(val) => setFormData(prev => ({ ...prev, content: val }))}
                    />
                </div>

                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Publish
                </button>
            </form>
        </div>
    );
};

export default Admin;
