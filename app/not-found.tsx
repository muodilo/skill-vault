import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <h1 className="text-6xl font-extrabold text-primaryColor mb-4">404</h1>
      <h2 className="text-3xl font-semibold text-gray-800 mb-2">Page Not Found</h2>
      <p className="text-gray-600 mb-6 max-w-md text-center">
        Sorry, the resource you are looking for could not be found.
      </p>
      <Link href="/dashboard">
        <p className="inline-block bg-primaryColor text-white px-6 py-3 rounded-md font-medium transition">
          Return Home
        </p>
      </Link>
    </div>
  );
}
