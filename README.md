# SWVL Enterprise Transport Solution Demo

A modern, interactive marketing landing page for SWVL's enterprise transport solutions in the UAE. This demo allows enterprise customers to visualize how SWVL optimizes transportation routes for their workforce.

## Features

- 🗺️ **Interactive Google Maps Integration** - Search and select office locations in the UAE
- 👥 **Dynamic Passenger Configuration** - Drag slider to set number of employees
- ⚙️ **Flexible Constraints** - Set maximum travel time and distance
- 🚗 **3D Vehicle Selection** - Game-like 3D interface to select from sedan, van, or bus
- 🛣️ **Route Optimization** - Two optimization scenarios:
  - **Cost-Saving**: Minimize costs with larger vehicles (~70% utilization)
  - **Experience-Optimizing**: Enhance UX with smaller vehicles (up to 95% utilization)
- 📊 **Live Monitoring Dashboard** - Real-time route tracking and metrics
- ✨ **Smooth Animations** - Polished UI with Framer Motion animations
- 🎨 **SWVL Brand Design** - Follows SWVL design guidelines

## Tech Stack

- **Next.js 14** (App Router) with TypeScript
- **Three.js** with React Three Fiber for 3D graphics
- **Google Maps JavaScript API** for maps and location services
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Zustand** for state management

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Google Maps API key with the following APIs enabled:
  - Maps JavaScript API
  - Places API
  - Geocoding API

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd SWVL
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Netlify

### Quick Deploy

1. **Push to Git Repository** (GitHub/GitLab/Bitbucket)
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Deploy via Netlify Dashboard**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your Git repository
   - Netlify will auto-detect Next.js settings

3. **Set Environment Variables**
   - Go to Site settings → Environment variables
   - Add: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` = `AIzaSyC-MjwszwkhNnrt9Fhj6m84pgJAxewaCjw`

4. **Deploy**
   - Click "Deploy site"
   - Wait for build to complete

### Deploy via Netlify CLI

```bash
# Install Netlify CLI globally (if not already installed)
npm install -g netlify-cli

# Login to Netlify
netlify login

# Create new site and deploy
netlify deploy --create-site swvl-enterprise-transport --dir=.next --prod

# Or use the deployment script
./deploy-netlify.sh
```

### Environment Variables in Netlify

Make sure to set these in Netlify Dashboard (Site settings → Environment variables):
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: Your Google Maps API key

## Project Structure

```
SWVL/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Main landing page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Map/              # Map-related components
│   ├── VehicleSelector/ # 3D vehicle selection
│   ├── Controls/         # Input controls
│   ├── Dashboard/        # Monitoring dashboard
│   ├── Optimization/     # Optimization scenarios
│   └── UI/               # Reusable UI components
├── lib/                   # Utilities and stores
│   ├── store.ts          # Zustand state management
│   ├── routeOptimizer.ts # Route optimization logic
│   └── constants.ts      # Constants and config
├── hooks/                 # Custom React hooks
├── public/                # Static assets
└── netlify.toml          # Netlify configuration
```

## Build Settings

- **Build command**: `npm run build`
- **Publish directory**: `.next`
- **Node version**: 18

## License

Private - SWVL Enterprise
