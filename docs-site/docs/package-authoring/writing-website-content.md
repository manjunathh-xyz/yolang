# Writing Website Content

Creating content for the Kexra package website.

## Why this exists

Package website content helps users discover and evaluate packages.

## How it works

Create a JSON metadata file in the site/packages/ directory with package information.

## Examples

```json
{
  "name": "my-package",
  "description": "A useful utility package",
  "author": "myusername",
  "version": "1.0.0",
  "repo": "https://github.com/myusername/my-package"
}
```

## Common mistakes

- Inaccurate descriptions
- Wrong repository URLs
- Missing required fields

## Related topics

- [Publishing via PR](publishing-via-pr.md)
- [Writing Docs](writing-docs.md)
- [Versioning](versioning.md)
