import { notFound } from 'next/navigation';
import { getPackages, getPackageMeta, getPackageWebsite } from '@/lib/packages';
import { remark } from 'remark';
import html from 'remark-html';

interface PageProps {
  params: {
    name: string;
  };
}

export async function generateStaticParams() {
  const packages = getPackages();
  return packages.map((pkg) => ({
    name: pkg.name,
  }));
}

export default async function PackagePage({ params }: PageProps) {
  const meta = getPackageMeta(params.name);
  const website = getPackageWebsite(params.name);

  if (!meta || !website) {
    notFound();
  }

  const processedContent = await remark().use(html).process(website);
  const contentHtml = processedContent.toString();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{meta.name}</h1>
        <p className="text-xl text-gray-600">{meta.description}</p>
        <div className="mt-4 text-sm text-gray-500">
          <p>Version: {meta.version}</p>
          <p>Author: {meta.author}</p>
        </div>
      </div>

      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: contentHtml }} />

      <div className="mt-8 space-x-4">
        <a href={`/packages/${params.name}/docs`} className="text-blue-600 hover:text-blue-800">
          View Documentation
        </a>
        <a href={meta.repo} className="text-blue-600 hover:text-blue-800">
          View on GitHub
        </a>
      </div>
    </div>
  );
}
