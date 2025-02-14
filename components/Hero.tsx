"use client";
import Form from "next/form";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { X } from "lucide-react";
import Card from "./Card";
type User = {
  id?: string;
  email?: string;
  name?: string;
};

export default function Hero({ user }: { user: User }) {
  const [query, setQuery] = useState("");
  const [posts, setPost] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("https://jastip-be.onrender.com/post", {
          method: "GET",
          credentials: "include", // Send cookies with the request
        });

        if (!res.ok) console.log("Token Invalid");

        const data = await res.json();
        setPost(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts(); // Call the function inside useEffect
  }, []); // Empty array ensures it runs once on mount

  const reset = () => {
    setQuery("");
    const form = document.querySelector(".search-form") as HTMLFormElement;
    if (form) form.reset();
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };
  return (
    <div>
      <div className="pink_container">
        <section>
          <h1 className="heading "> Web Jastip Group KBBI</h1>
          <p className="sub-heading !max-w-3xl">
            Jastip dengan aman bersama KBBI Indonesia-Korea
          </p>
          {user.id && (
            <div>
              <Form action="/" scroll={false} className="search-form">
                <input
                  name="query"
                  value={query}
                  onChange={handleChange}
                  className="search-input"
                  placeholder="Search keyword"
                />
                <div className="flex gap-2">
                  {query && (
                    <button type="reset" onClick={reset}>
                      <Link href="/" className="search-btn text-white">
                        <X className="size-5" />
                      </Link>
                    </button>
                  )}
                  <button type="submit" className="search-btn text-white">
                    <Search className="size-5" />
                  </button>
                </div>
              </Form>
            </div>
          )}
        </section>
      </div>
      {user.id && (
        <div>
          <section className="section_container">
            <p className="text-30-semibold">
              {query ? `Search results for "${query}"` : "All Jastip"}
            </p>
            <ul className="mt-7 card_grid">
              {posts?.length > 0 ? (
                posts
                  .toReversed()
                  .map((post, number) => <Card key={number} post={post} />)
              ) : (
                <p className="no-results">No jastip found</p>
              )}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
}
