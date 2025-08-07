import GoogleCallback from "../../../Component/GoogleCallback";

export default function Page({ searchParams }) {
  const token = searchParams.token;

  return <GoogleCallback token={token} />;
}
