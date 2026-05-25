# Frontend Documentation

This frontend is a Next.js app for the PlantGuard AI plant disease prediction project. It uses the App Router and is organized as a set of route-based pages under `app/`.

## Run It Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000` to view the app.

## App Structure

The main routes currently available in the frontend are:

- `/` for the landing page
- `/metrics` for the model performance dashboard
- `/login` and `/register` for authentication screens
- `/dashboard`, `/about`, and `/team` for supporting pages

The shared page shell is defined in `app/layout.tsx`, while the global color palette and typography live in `app/globals.css`.

## Font And Base Styling

The frontend does not use `next/font` or a custom web font loader. Instead, the global body style in `app/globals.css` sets the default typeface to `Georgia, serif`.

The same stylesheet also defines the project color tokens:

- `--forest`, `--forest-mid`, and `--forest-light` for the main green palette
- `--sage` and `--mint` for softer accent tones
- `--cream` and `--cream-dark` for the page background and warm surfaces

Because the font is set globally on the `body`, all pages inherit the same serif look unless a component overrides it inline.

## Metrics Page

The model metrics screen is implemented in `app/metrics/page.tsx`. It is a client component that fetches training history from `/api/history`, stores it in local state, and renders the latest record as the active snapshot.

### What It Shows

The dashboard is split into several visual sections:

- A sticky top navbar with the PlantGuard AI brand and a back link
- A hero header that introduces the model as MobileNetV2 based plant disease classification
- Summary cards for the latest validation accuracy, training accuracy, validation loss, and training loss
- A classification panel with radial progress indicators for accuracy, precision, recall, and F1 score
- A comparison panel with horizontal bars for train versus validation metrics
- A loss analysis section that compares training and validation loss side by side
- A final model information card with the dataset and architecture summary

### How The Metrics Are Formatted

The page reads the most recent history entry and uses it as the source of truth for the displayed numbers.

- Accuracy values are shown as percentages with two decimal places in the summary cards.
- Loss values are shown with four decimal places.
- Precision, recall, and F1 are multiplied by 100 before being rendered in the charts and bars.
- The radial charts draw an SVG progress ring, and the bars animate their width from the metric value.

### Visual Behavior

The metrics page uses inline styles plus a small local style block for animation and hover effects.

- Cards fade in with a simple upward motion
- The leaf doodle SVG floats gently in the header
- Metric cards lift on hover with a shadow change
- The page uses a responsive grid so the cards collapse cleanly on smaller screens

## Data Flow

The metrics page depends on the backend history endpoint:

1. The component mounts on the client.
2. It requests `/api/history`.
3. The response is stored in `history` state.
4. The last entry in the array is used to populate the dashboard.

If the request fails or no records exist, the page shows a simple fallback state instead of rendering empty charts.

## Notes For Contributors

- Keep new frontend pages consistent with the existing green-and-cream visual system.
- Prefer updating `app/globals.css` when changing shared typography or palette values.
- If you change the metrics schema, update the `HistoryEntry` type in `app/metrics/page.tsx` and the backend history payload together.
