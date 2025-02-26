import { PostList } from "../components/PostList";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();
  return (
    <>
      <p>Welcome {session?.user.name}!</p>
      <PostList />
    </>
  );
}
