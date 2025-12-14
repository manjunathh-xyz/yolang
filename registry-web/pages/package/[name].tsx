import { GetStaticProps, GetStaticPaths } from 'next';
import { getPackage, PackageInfo } from '../../lib/api';

interface PackageProps {
  pkg: PackageInfo | null;
}

export default function Package({ pkg }: PackageProps) {
  if (!pkg) {
    return <div>Package not found</div>;
  }

  return (
    <div
      style={{
        fontFamily: 'Arial, sans-serif',
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px',
      }}
    >
      <h1>{pkg.name}</h1>
      <p>Version: {pkg.version}</p>
      {pkg.description && <p>{pkg.description}</p>}
      {pkg.author && <p>Author: {pkg.author}</p>}
      {pkg.license && <p>License: {pkg.license}</p>}

      <h2>Install</h2>
      <pre>kex install {pkg.name}</pre>

      <h2>Versions</h2>
      <ul>
        <li>{pkg.version}</li>
      </ul>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  // Provide known package paths without fetching
  const paths = [
    { params: { name: 'math' } },
    { params: { name: 'math-extra' } }
  ];
  return {
    paths,
    fallback: 'blocking', // Allow dynamic paths
  };
};
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const pkg = await getPackage(params?.name as string);
  return {
    props: { pkg },
  };
};
