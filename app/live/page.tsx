"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { database } from "../firebase";
import {
  ref,
  onValue,
  push,
  set,
  get,
  increment,
  onDisconnect,
} from "firebase/database";
import type { Comment, LiveStream } from "../types";

export default function LivePage() {
  const [stream, setStream] = useState<LiveStream | null>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [username, setUsername] = useState("");
  const [tempUsername, setTempUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const commentsRef = useRef<HTMLDivElement>(null);
  const viewerRefCleanup = useRef<(() => void) | null>(null);

  useEffect(() => {
    fetchStream();
    const interval = setInterval(fetchStream, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (stream?.id) {
      initializeFirebaseData();
      const cleanup = setupFirebaseListeners();
      return () => {
        if (cleanup) cleanup();
        if (viewerRefCleanup.current) {
          viewerRefCleanup.current();
        }
      };
    }
  }, [stream?.id]);

  // Handle browser/tab close
  useEffect(() => {
    if (!stream?.id) return;

    const handleBeforeUnload = () => {
      const viewersRef = ref(database, `streams/${stream.id}/viewers`);
      set(viewersRef, increment(-1));
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [stream?.id]);

  const initializeFirebaseData = async () => {
    if (!stream?.id) return;

    try {
      const streamRef = ref(database, `streams/${stream.id}`);
      const snapshot = await get(streamRef);

      if (!snapshot.exists()) {
        console.log("Initializing new stream data");
        await set(streamRef, {
          id: stream.id,
          title: stream.title,
          youtube_url: stream.youtube_url,
          is_active: true,
          viewers: 0,
          comments: {},
        });
      }

      // Set up viewer count with disconnect handling
      const viewersRef = ref(database, `streams/${stream.id}/viewers`);

      // Increment viewer count when joining
      await set(viewersRef, increment(1));

      // Set up automatic cleanup when client disconnects
      const onDisconnectRef = onDisconnect(viewersRef);
      await onDisconnectRef.set(snapshot.val()?.viewers ? increment(-1) : 0);

      // Store cleanup function
      viewerRefCleanup.current = () => {
        onDisconnectRef.cancel();
        set(viewersRef, increment(-1));
      };

      console.log("Viewer tracking initialized");
    } catch (error) {
      console.error("Error initializing Firebase data:", error);
      setError("Failed to initialize chat. Please refresh the page.");
    }
  };

  const setupFirebaseListeners = () => {
    if (!stream?.id) return;

    try {
      // Listen for comments
      const commentsRef = ref(database, `streams/${stream.id}/comments`);
      const unsubscribeComments = onValue(commentsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const commentsList = Object.values(data) as Comment[];
          setComments(commentsList.sort((a, b) => b.timestamp - a.timestamp));
        } else {
          setComments([]);
        }
      });

      // Listen for viewer count
      const viewersRef = ref(database, `streams/${stream.id}/viewers`);
      const unsubscribeViewers = onValue(viewersRef, (snapshot) => {
        const viewerCount = snapshot.val() || 0;
        console.log("Current viewer count:", viewerCount);
        setStream((prev) => (prev ? { ...prev, viewerCount } : null));
      });

      return () => {
        unsubscribeComments();
        unsubscribeViewers();
      };
    } catch (error) {
      console.error("Error setting up Firebase listeners:", error);
      setError("Failed to connect to chat. Please refresh the page.");
    }
  };

  // Auto scroll to bottom when new comments arrive
  useEffect(() => {
    if (commentsRef.current) {
      commentsRef.current.scrollTop = commentsRef.current.scrollHeight;
    }
  }, [comments]);

  const fetchStream = async () => {
    try {
      const response = await axios.get("/api/live-stream");
      if (response.data && response.data.is_active) {
        setStream(response.data);
      } else {
        setStream(null);
      }
      setLoading(false);
      setError(null);
    } catch (error) {
      console.error("Error fetching stream:", error);
      setLoading(false);
      setError("Failed to load stream data. Please refresh the page.");
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    setUsername(tempUsername);
    e.preventDefault();
    if (!stream?.id || !newComment.trim() || !username.trim()) return;

    try {
      const comment: Comment = {
        id: Math.random().toString(36).substr(2, 9),
        userId: Math.random().toString(36).substr(2, 9),
        username: username.trim(),
        message: newComment.trim(),
        timestamp: Date.now(),
      };

      const commentsRef = ref(database, `streams/${stream.id}/comments`);
      await push(commentsRef, comment);
      setNewComment("");
      setError(null);
    } catch (error) {
      console.error("Error posting comment:", error);
      setError("Failed to send comment. Please try again.");
    }
  };

  const getEmbedUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      let videoId = "";

      if (urlObj.hostname.includes("youtube.com")) {
        videoId = urlObj.searchParams.get("v") || "";
      } else if (urlObj.hostname.includes("youtu.be")) {
        videoId = urlObj.pathname.substring(1);
      }

      return `https://www.youtube.com/embed/${videoId}`;
    } catch {
      return "";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!stream || !stream.youtube_url) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              No Live Stream Available
            </h1>
            <p className="text-gray-600">
              There is currently no active live stream. Please check back later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          <span className="border-b-4 border-blue-500 pb-2">Live Stream</span>
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="aspect-video">
                <iframe
                  src={getEmbedUrl(stream.youtube_url)}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {stream.title}
                  </h2>
                  <div className="flex items-center space-x-4">
                    <span className="px-3 py-1 bg-red-500 text-white text-sm font-semibold rounded-full animate-pulse">
                      LIVE NOW
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-semibold rounded-full">
                      {stream?.viewerCount !== undefined
                        ? stream.viewerCount
                        : 0}{" "}
                      watching
                    </span>
                  </div>
                </div>
                <div className="prose max-w-none">
                  <p className="text-gray-600">Welcome to our live stream!</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex flex-col h-[600px]">
              <h3 className="text-lg font-semibold mb-4">Live Chat</h3>

              <div
                ref={commentsRef}
                className="flex-1 overflow-y-auto mb-4 space-y-4"
              >
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-gray-50 rounded p-3">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-sm text-blue-600">
                        {comment.username}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(comment.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mt-1">
                      {comment.message}
                    </p>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSubmitComment} className="mt-auto">
                {!username && (
                  <input
                    type="text"
                    placeholder="Enter your username"
                    value={tempUsername}
                    onChange={(e) => setTempUsername(e.target.value)}
                    className="w-full p-2 mb-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                )}
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={!tempUsername}
                  >
                    Send
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
