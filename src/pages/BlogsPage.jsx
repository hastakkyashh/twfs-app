import React, { useState, useEffect } from 'react';
import { Calendar, ArrowRight } from 'lucide-react';
import { SectionTitle } from '../components/ui';

const BlogsPage = ({ navigate }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/blogs.json')
      .then(response => response.json())
      .then(data => {
        setBlogs(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading blogs:', error);
        setLoading(false);
      });
  }, []);

  const handleBlogClick = (blogId) => {
    window.location.hash = `blog-detail-${blogId}`;
    navigate(`blog-detail-${blogId}`);
  };

  if (loading) {
    return (
      <section className="py-16 px-6 max-w-7xl mx-auto animate-fade-in">
        <SectionTitle title="Blogs" subtitle="Stay informed with expert advice on investments, insurance, and financial planning" />
        <div className="text-center text-slate-600">Loading blogs...</div>
      </section>
    );
  }

  return (
    <section className="py-16 px-6 max-w-7xl mx-auto animate-fade-in">
      <SectionTitle title="Blogs" subtitle="Stay informed with expert advice on investments, insurance, and financial planning" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {blogs.map((blog) => (
          <div
            key={blog.id}
            onClick={() => handleBlogClick(blog.id)}
            className="bg-white p-6 rounded-lg shadow-sm border border-slate-100 cursor-pointer transition-all duration-300 hover:shadow-md hover:border-primary-green"
          >
            <div className="flex items-center gap-2 text-slate-500 text-sm mb-3">
              <Calendar size={16} />
              <span>{blog.date}</span>
            </div>
            
            <h3 className="text-xl font-bold text-slate-900 mb-3 transition-colors hover:text-dark-green">
              {blog.title}
            </h3>
            
            <p className="text-slate-600 mb-4 line-clamp-3">
              {blog.description}
            </p>
            
            <div className="flex items-center gap-2 text-dark-green font-semibold text-sm">
              Read More <ArrowRight size={16} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BlogsPage;
