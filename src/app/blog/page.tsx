import {fetchPages} from "@/lib/notion";
import {JSX} from "react";

export default async function Blog(): Promise<JSX.Element> {
    const posts = await fetchPages();
    return (
        <div>
            <h1>Blog</h1>
            <ul>
                {
                    posts.map((post) => {
                        const link = `blog/${post.slug}`;
                        return <li key={post.id}>
                            <a href={link}>
                                {post.title}
                            </a>
                        </li>
                    })
                }
            </ul>
        </div>
    )
}