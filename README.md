# html-boilerplate

Simple HTML boilerplate using [Eta](https://eta.js.org/) templates and [PostCSS](https://postcss.org/).

## Requirements

- [Bun](https://bun.sh/) >= 1.0.0

## Getting Started

```bash
bun install
bun run watch
```

## Scripts

| Command | Description |
|---|---|
| `bun run watch` | Start dev server and watch for changes |
| `bun run build` | Production build (CSS, HTML, images) |
| `bun run clean` | Remove the `public/` directory |
| `bun run serve` | Start dev server only |
| `bun run imagemin` | Optimize images |

## Project Structure

```
src/
├── assets/
│   ├── css/        # PostCSS source files (.pcss)
│   ├── images/     # Source images
│   └── js/         # JavaScript files
├── components/     # Eta partial templates
├── layouts/        # Eta layout templates
└── pages/          # Eta page templates
public/             # Build output (generated)
```

## License

Apache-2.0
