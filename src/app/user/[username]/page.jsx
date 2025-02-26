import { db } from "@/db";
import Image from "next/image";
import { Vote } from "../../../components/Vote";
import Link from "next/link";
export default async function UserProfile({ params }) {
  const username = decodeURIComponent(params.username);

  const { rows: users } = await db.query(`SELECT * FROM users WHERE name=$1`, [
    username,
  ]);
  const user = users[0];

  console.log(user);

  if (!user) {
    return <div>User not found</div>;
  }
  const fallbackImage = "/nunavut.jpg";

  // to get posts
  const userId = users[0].id;

  const { rows: posts } = await db.query(
    `
    SELECT posts.id, posts.title, posts.body, posts.created_at, users.name, 
           COALESCE(SUM(votes.vote), 0) AS vote_total
    FROM posts
    JOIN users ON posts.user_id = users.id
    LEFT JOIN votes ON votes.post_id = posts.id
    WHERE posts.user_id = $1
    GROUP BY posts.id, users.name
   ORDER BY posts.created_at DESC
  `,
    [userId]
  );

  return (
    <>
      <div className="max-w-screen-lg mx-auto pt-4 pr-4 flex flex-col justify-center items-center">
        <div
          className={`flex justify-center flex-col items-center w-full sm:w-[500px] max-w-lg p-8 rounded-lg shadow-lg bg-white`}
        >
          <h1 className="text-2xl font-semibold text-purple-400 mb-6">
            User Profile Page
          </h1>
          <div className="flex flex-col items-center gap-6">
            <Image
              src={user.image || fallbackImage}
              alt="User profile image"
              width={150}
              height={150}
              style={{ objectFit: "contain" }}
              className="rounded-full"
            />
            <h2 className="text-xl font-semibold text-gray-400">{user.name}</h2>
          </div>
        </div>
        <h1 className="text-2xl font-semibold text-purple-400 mb-6">
          All Post
        </h1>
        <ul className="max-w-screen-lg mx-auto p-4 mb-4">
          {posts.map((post) => (
            <li
              key={post.id}
              className=" py-4 flex space-x-6 hover:bg-zinc-200 rounded-lg"
            >
              <Vote postId={post.id} votes={post.vote_total} />
              <div>
                <Link
                  href={`/post/${post.id}`}
                  className="text-2xl hover:text-pink-500"
                >
                  {post.title}
                </Link>
                <p className="text-zinc-700">
                  posted by
                  <Link
                    href={`/user/${encodeURIComponent(post.name)}`}
                    className="text-xl hover:text-pink-500"
                  >
                    {post.name}
                  </Link>
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
