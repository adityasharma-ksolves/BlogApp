import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { User, Edit, PenLine, TrendingUp } from "lucide-react";
import PostCard from "../components/post/PostCard";
import { useAuth } from "../context/AuthContext";
import { getMyPosts } from "../api/axios.js";
import { PageLoader } from "../components/ui/Spinner";
import { SkeletonCard } from "../components/ui/Spinner";

export default function Profile() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalPosts: 0, totalLikes: 0 });

  useEffect(() => {
    if (user) {
      fetchMyPosts();
    }
  }, [user]);

  const fetchMyPosts = async () => {
    try {
      setLoading(true);
      const res = await getMyPosts();
      setPosts(res.data.posts || []);
      // Mock stats
      setStats({
        totalPosts: res.data.posts?.length || 0,
        totalLikes:
          res.data.posts?.reduce((sum, p) => sum + (p.likes || 0), 0) || 0,
      });
    } catch (err) {
      console.error("Failed to fetch posts", err);
    } finally {
      setLoading(false);
    }
  };

  if (!user)
    return <p className="p-8 text-center text-ink-muted">Loading profile...</p>;

  return (
    <div className="min-h-screen pt-16 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-accent/10 border border-accent/20 rounded-full px-6 py-3 mb-6">
            <User size={20} className="text-accent" />
            <span className="text-lg font-medium text-accent-dark">
              {user.role || "user"}
            </span>
          </div>
          <div className="w-24 h-24 bg-accent-light rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-semibold text-accent-dark">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-ink mb-2">
            {user.name}
          </h1>
          <p className="text-lg text-ink-muted mb-8">{user.email}</p>
          {user.age && (
            <p className="text-xl font-medium text-accent mb-8">
              {user.age} years old
            </p>
          )}
          <Link to="/write" className="btn-accent">
            <PenLine size={16} className="ml-1" />
            Write New Post
          </Link>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="text-center p-6 bg-paper-card border border-border rounded-xl">
            <TrendingUp size={32} className="mx-auto mb-2 text-accent" />
            <div className="text-3xl font-bold text-ink">
              {stats.totalPosts}
            </div>
            <p className="text-ink-muted">Posts</p>
          </div>
          <div className="text-center p-6 bg-paper-card border border-border rounded-xl">
            <Heart size={32} className="mx-auto mb-2 text-accent" />
            <div className="text-3xl font-bold text-ink">
              {stats.totalLikes}
            </div>
            <p className="text-ink-muted">Likes</p>
          </div>
          <div className="text-center p-6 bg-paper-card border border-border rounded-xl">
            <PenLine size={32} className="mx-auto mb-2 text-accent" />
            <div className="text-3xl font-bold text-ink">0</div>
            <p className="text-ink-muted">Drafts</p>
          </div>
        </div>

        {/* My Posts */}
        <div>
          <h2 className="text-2xl font-serif font-bold mb-6 flex items-center gap-2">
            <Edit size={24} className="text-accent" />
            Your Stories
          </h2>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-24">
              <PenLine
                size={64}
                className="mx-auto mb-6 text-ink-muted opacity-40"
              />
              <h3 className="text-xl font-semibold text-ink mb-2">
                No posts yet
              </h3>
              <p className="text-ink-muted mb-6">
                Your stories will appear here once published.
              </p>
              <Link to="/write" className="btn-accent">
                Write Your First Story
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <PostCard key={post.post_id} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
