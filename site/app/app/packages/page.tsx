import Link from 'next/link';
import { getPackages } from '@/lib/packages';

export default function PackagesPage() {
  const packages = getPackages();

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Packages</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {packages.map((pkg) => (
          <div key={pkg.name} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              <Link href={`/packages/${pkg.name}`} className="hover:text-blue-600">
                {pkg.name}
              </Link>
            </h2>
            <p className="text-gray-600 mb-4">{pkg.description}</p>
            <div className="text-sm text-gray-500">
              <p>Version: {pkg.version}</p>
              <p>Author: {pkg.author}</p>
            </div>
            <div className="mt-4 space-x-2">
              <Link href={`/packages/${pkg.name}`} className="text-blue-600 hover:text-blue-800">
                Website
              </Link>
              <Link
                href={`/packages/${pkg.name}/docs`}
                className="text-blue-600 hover:text-blue-800"
              >
                Docs
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
