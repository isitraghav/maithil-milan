import { getUserProfile } from "./server";

export default async function BlogPost({ params }) {
  const { slug } = await params;

  await getUserProfile(slug);

  return (
    <div>
      <h1>Post: {slug}</h1>
    </div>
  );
}

