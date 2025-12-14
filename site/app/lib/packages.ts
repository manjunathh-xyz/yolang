import fs from 'fs';
import path from 'path';

export interface PackageMeta {
  name: string;
  version: string;
  description: string;
  author: string;
  license: string;
  repo: string;
}

export function getPackages(): PackageMeta[] {
  const packagesDir = path.join(process.cwd(), '..', 'packages');
  const sitePackagesDir = path.join(process.cwd(), '..', 'site', 'packages');

  if (!fs.existsSync(packagesDir) || !fs.existsSync(sitePackagesDir)) {
    return [];
  }

  const packageDirs = fs
    .readdirSync(packagesDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  const packages: PackageMeta[] = [];

  for (const pkgName of packageDirs) {
    const metaPath = path.join(sitePackagesDir, pkgName, 'meta.json');
    if (fs.existsSync(metaPath)) {
      try {
        const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8')) as PackageMeta;
        if (meta.name === pkgName) {
          packages.push(meta);
        }
      } catch (error) {
        // Skip invalid meta.json
      }
    }
  }

  return packages;
}

export function getPackageMeta(name: string): PackageMeta | null {
  const metaPath = path.join(process.cwd(), '..', 'site', 'packages', name, 'meta.json');
  if (!fs.existsSync(metaPath)) {
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(metaPath, 'utf-8')) as PackageMeta;
  } catch {
    return null;
  }
}

export function getPackageWebsite(name: string): string | null {
  const websitePath = path.join(
    process.cwd(),
    '..',
    'site',
    'packages',
    name,
    'website',
    'index.md'
  );
  if (!fs.existsSync(websitePath)) {
    return null;
  }
  return fs.readFileSync(websitePath, 'utf-8');
}

export function getPackageDocs(name: string): string | null {
  const docsPath = path.join(process.cwd(), '..', 'site', 'packages', name, 'README.md');
  if (!fs.existsSync(docsPath)) {
    return null;
  }
  return fs.readFileSync(docsPath, 'utf-8');
}
