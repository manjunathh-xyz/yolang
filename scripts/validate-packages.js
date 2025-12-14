const fs = require('fs');
const path = require('path');

function validateSemver(version) {
  const semverRegex = /^\d+\.\d+\.\d+$/;
  return semverRegex.test(version);
}

function validatePackages() {
  const packagesDir = path.join(__dirname, '..', 'packages');

  if (!fs.existsSync(packagesDir)) {
    console.log('No packages directory found');
    return;
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
      throw new Error(`Package ${pkgName} missing kexra.json`);
    }

    // Validate kexra.json
    const kexraJson = JSON.parse(fs.readFileSync(kexraJsonPath, 'utf-8'));
    if (
      !kexraJson.name ||
      !kexraJson.version ||
      !kexraJson.description ||
      !kexraJson.author ||
      !kexraJson.license
    ) {
      throw new Error(`Package ${pkgName} kexra.json missing required fields`);
    }
    if (kexraJson.name !== pkgName) {
      throw new Error(`Package ${pkgName} folder name does not match kexra.json.name`);
    }
    if (!validateSemver(kexraJson.version)) {
      throw new Error(`Package ${pkgName} has invalid semver version`);
    }

    // Check src/index.kx exists
    if (!fs.existsSync(srcIndexPath)) {
      throw new Error(`Package ${pkgName} missing src/index.kx`);
    }

    // Check for duplicate names
    if (names.has(kexraJson.name)) {
      throw new Error(`Duplicate package name: ${kexraJson.name}`);
    }
    names.add(kexraJson.name);
  }

  console.log('All packages validated successfully');
}

validatePackages();
