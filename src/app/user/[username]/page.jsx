import { db } from "@/db";
import Image from "next/image";

export default async function UserProfile({ params }) {
  const username = decodeURIComponent(params.username);

  const { rows: users } = await db.query(`SELECT * FROM users WHERE name=$1`, [
    username,
  ]);
  const user = users[0];

  console.log(user);

  console.log("Searching for user with name:", username);
  if (!user) {
    return <div>User not found</div>;
  }
  const fallbackImage = "/nunavut.jpg";

  return (
    <>
      <div className="max-w-screen-lg mx-auto pt-4 pr-4 flex justify-center items-center">
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
      </div>
    </>
  );
}
