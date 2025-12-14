import { notFound } from 'next/navigation';
import { getPackages, getPackageMeta, getPackageDocs } from '@/lib/packages';
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

export default async function PackageDocsPage({ params }: PageProps) {
  const meta = getPackageMeta(params.name);
  const docs = getPackageDocs(params.name);

  if (!meta || !docs) {
    notFound();
  }

  const processedContent = await remark().use(html).process(docs);
  const contentHtml = processedContent.toString();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{meta.name} Documentation</h1>
        <p className="text-xl text-gray-600">{meta.description}</p>
        <div className="mt-4 text-sm text-gray-500">
          <p>Version: {meta.version}</p>
          <p>Author: {meta.author}</p>
        </div>
      </div>

      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: contentHtml }} />

      <div className="mt-8 space-x-4">
        <a href={`/packages/${params.name}`} className="text-blue-600 hover:text-blue-800">
          View Website
        </a>
        <a href={meta.repo} className="text-blue-600 hover:text-blue-800">
          View on GitHub
        </a>
      </div>
    </div>
  );
}
