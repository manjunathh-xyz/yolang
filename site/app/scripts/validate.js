const fs = require('fs');
const path = require('path');

function validateSemver(version) {
  const semverRegex = /^\d+\.\d+\.\d+$/;
  return semverRegex.test(version);
}

function validatePackages() {
  const packagesDir = path.join(__dirname, '..', '..', 'packages');
  const sitePackagesDir = path.join(__dirname, '..', '..', 'site', 'packages');

  if (!fs.existsSync(packagesDir)) {
    console.error('No packages directory found');
    process.exit(1);
  }

  const packageDirs = fs
    .readdirSync(packagesDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  const names = new Set();

  for (const pkgName of packageDirs) {
    const pkgDir = path.join(packagesDir, pkgName);
    const kexraJsonPath = path.join(pkgDir, 'kexra.json');
    const srcIndexPath = path.join(pkgDir, 'src', 'index.kx');

    // Check kexra.json exists
    if (!fs.existsSync(kexraJsonPath)) {
      console.error(`Package ${pkgName} missing kexra.json`);
      process.exit(1);
    }

    // Validate kexra.json
    let kexraJson;
    try {
      kexraJson = JSON.parse(fs.readFileSync(kexraJsonPath, 'utf-8'));
    } catch (error) {
      console.error(`Package ${pkgName} kexra.json is invalid JSON`);
      process.exit(1);
    }
    if (
      !kexraJson.name ||
      !kexraJson.version ||
      !kexraJson.description ||
      !kexraJson.author ||
      !kexraJson.license
    ) {
      console.error(`Package ${pkgName} kexra.json missing required fields`);
      process.exit(1);
    }
    if (kexraJson.name !== pkgName) {
      console.error(`Package ${pkgName} folder name does not match kexra.json.name`);
      process.exit(1);
    }
    if (!validateSemver(kexraJson.version)) {
      console.error(`Package ${pkgName} has invalid semver version`);
      process.exit(1);
    }

    // Check src/index.kx exists
    if (!fs.existsSync(srcIndexPath)) {
      console.error(`Package ${pkgName} missing src/index.kx`);
      process.exit(1);
    }

    // Check site package exists
    const sitePkgDir = path.join(sitePackagesDir, pkgName);
    if (!fs.existsSync(sitePkgDir)) {
      console.error(`Package ${pkgName} missing site documentation`);
      process.exit(1);
    }

    // Check meta.json exists
    const metaJsonPath = path.join(sitePkgDir, 'meta.json');
    if (!fs.existsSync(metaJsonPath)) {
      console.error(`Package ${pkgName} missing meta.json`);
      process.exit(1);
    }

    // Validate meta.json
    let metaJson;
    try {
      metaJson = JSON.parse(fs.readFileSync(metaJsonPath, 'utf-8'));
    } catch (error) {
      console.error(`Package ${pkgName} meta.json is invalid JSON`);
      process.exit(1);
    }
    if (
      !metaJson.name ||
      !metaJson.version ||
      !metaJson.description ||
      !metaJson.author ||
      !metaJson.license ||
      !metaJson.repo
    ) {
      console.error(`Package ${pkgName} meta.json missing required fields`);
      process.exit(1);
    }
    if (metaJson.name !== pkgName) {
      console.error(`Package ${pkgName} meta.json name does not match folder name`);
      process.exit(1);
    }
    if (metaJson.version !== kexraJson.version) {
      console.error(`Package ${pkgName} version mismatch between kexra.json and meta.json`);
      process.exit(1);
    }
    if (!validateSemver(metaJson.version)) {
      console.error(`Package ${pkgName} meta.json has invalid semver version`);
      process.exit(1);
    }

    // Check README.md exists
    const readmePath = path.join(sitePkgDir, 'README.md');
    if (!fs.existsSync(readmePath)) {
      console.error(`Package ${pkgName} missing README.md`);
      process.exit(1);
    }

    // Check website/index.md exists
    const websiteIndexPath = path.join(sitePkgDir, 'website', 'index.md');
    if (!fs.existsSync(websiteIndexPath)) {
      console.error(`Package ${pkgName} missing website/index.md`);
      process.exit(1);
    }

    // Check for duplicate names
    if (names.has(kexraJson.name)) {
      console.error(`Duplicate package name: ${kexraJson.name}`);
      process.exit(1);
    }
    names.add(kexraJson.name);
  }

  console.log('All packages validated successfully');
}

validatePackages();
