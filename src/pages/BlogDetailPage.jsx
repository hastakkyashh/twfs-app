import React, { useState, useEffect } from 'react';
import { Calendar, ArrowLeft } from 'lucide-react';

const BlogDetailPage = ({ navigate, blogId }) => {
  const [blog, setBlog] = useState(null);
  const [allBlogs, setAllBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/blogs.json')
      .then(response => response.json())
      .then(data => {
        setAllBlogs(data);
        const foundBlog = data.find(b => b.id === blogId);
        setBlog(foundBlog);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading blog:', error);
        setLoading(false);
      });
  }, [blogId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-slate-600">Loading blog...</div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Blog not found</h2>
          <button
            onClick={() => {
              window.location.hash = 'blogs';
              navigate('blogs');
            }}
            className="text-dark-green hover:underline"
          >
            Return to Blogs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <section className="bg-dark-green text-white py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => {
              window.location.hash = 'blogs';
              navigate('blogs');
            }}
            className="flex items-center gap-2 text-slate-200 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Blogs
          </button>
          
          <div className="flex items-center gap-2 text-slate-300 text-sm mb-4">
            <Calendar size={16} />
            <span>{blog.date}</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{blog.title}</h1>
          <p className="text-xl text-slate-200">{blog.description}</p>
        </div>
      </section>

      <section className="py-12 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div 
            className="prose prose-lg max-w-none
              prose-headings:text-slate-900 prose-headings:font-bold
              prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:text-dark-green
              prose-p:text-slate-700 prose-p:leading-relaxed prose-p:mb-4
              prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6
              prose-li:text-slate-700 prose-li:mb-2
              prose-strong:text-slate-900 prose-strong:font-semibold"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
          
          <div className="mt-12 pt-8 border-t border-slate-200">
            <div className="bg-slate-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Need Personalized Financial Advice?
              </h3>
              <p className="text-slate-600 mb-4">
                Our expert advisors at TrueWise FinSure are here to help you make informed financial decisions tailored to your unique goals.
              </p>
              <button
                onClick={() => {
                  window.location.hash = 'contact';
                  navigate('contact');
                }}
                className="bg-dark-green text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-green transition-colors"
              >
                Contact Us Today
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-slate-900 mb-6">More Articles</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {allBlogs.filter(b => b.id !== blog.id).slice(0, 2).map((relatedBlog) => (
              <div
                key={relatedBlog.id}
                onClick={() => {
                  window.location.hash = `blog-detail-${relatedBlog.id}`;
                  navigate(`blog-detail-${relatedBlog.id}`);
                  window.scrollTo(0, 0);
                }}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer p-5"
              >
                <div className="flex items-center gap-2 text-slate-500 text-sm mb-2">
                  <Calendar size={14} />
                  <span>{relatedBlog.date}</span>
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2 hover:text-dark-green transition-colors">
                  {relatedBlog.title}
                </h4>
                <p className="text-slate-600 text-sm line-clamp-2">
                  {relatedBlog.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogDetailPage;
