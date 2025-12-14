export default function Home() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Kexra</h1>
      <p className="text-xl text-gray-600 mb-8">
        A small, expressive scripting language built for learning and experimentation.
      </p>
      <div className="space-x-4">
        <a
          href="/packages"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
        >
          Browse Packages
        </a>
        <a
          href="https://github.com/manjunathh-xyz/kexra"
          className="bg-gray-200 text-gray-900 px-6 py-2 rounded-md hover:bg-gray-300"
        >
          View on GitHub
        </a>
      </div>
    </div>
  );
}
