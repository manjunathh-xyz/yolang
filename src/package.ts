import { Value, ValueType } from './runtime/values';
import { RuntimeError } from './errors/RuntimeError';

export class PackageManager {
  private manifestPath = 'kexra.json';
  private modulesDir = 'kex_modules';

  init(): void {
    const fs = require('fs');
    if (fs.existsSync(this.manifestPath)) {
      console.error('kexra.json already exists');
      return;
    }
    const manifest = {
      name: 'my-project',
      version: '0.1.0',
      description: 'A sample Kexra project',
      author: 'manjunathh-xyz',
      license: 'MIT',
      dependencies: {},
    };
    fs.writeFileSync(this.manifestPath, JSON.stringify(manifest, null, 2));
    console.log('Created kexra.json');
  }

  install(pkg?: string): void {
    if (!pkg) {
      // Install dependencies from manifest
      const manifest = this.readManifest();
      for (const [name, pkgPath] of Object.entries(manifest.dependencies || {})) {
        this.installPackage(pkgPath as string);
      }
      return;
    }

    // Parse pkg - can be github:user/repo or local path
    this.installPackage(pkg);
  }

  update(pkg?: string): void {
    console.log(`Updating ${pkg || 'all packages'}...`);
  }

  remove(pkg: string): void {
    console.log(`Removing ${pkg}...`);
  }

  list(): void {
    console.log('Installed packages:');
  }

  private installPackage(pkg: string): void {
    const fs = require('fs');
    const path = require('path');

    if (fs.existsSync(pkg)) {
      // Install from local path
      const packageName = path.basename(pkg);
      const destDir = path.join(this.modulesDir, packageName);

      console.log(`Installing from local path: ${pkg}...`);

      // Copy directory
      if (fs.existsSync(destDir)) {
        fs.rmSync(destDir, { recursive: true });
      }
      this.copyDir(pkg, destDir);

      console.log(`✓ Installed ${packageName}`);
    } else {
      console.error(`Package not found: ${pkg}`);
    }
  }

  private copyDir(src: string, dest: string): void {
    const fs = require('fs');
    const path = require('path');

    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }

    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        this.copyDir(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }

  private readManifest() {
    const fs = require('fs');
    if (!fs.existsSync(this.manifestPath)) {
      return { dependencies: {} };
    }
    return JSON.parse(fs.readFileSync(this.manifestPath, 'utf-8'));
  }
}
