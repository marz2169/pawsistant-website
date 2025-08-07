# Pawsistant - AI Call Assistant for Veterinary Clinics

A professional, responsive website demo showcasing Pawsistant, an AI-powered call assistant designed specifically for veterinary clinics. This B2B solution helps clinics manage calls, schedule appointments, handle emergencies, and improve overall client satisfaction.

## 🚀 Features

- **Responsive Design**: Optimized for all devices and screen sizes
- **Interactive Demo**: Live demonstration of AI assistant capabilities
- **Professional UI**: Clean, veterinary-focused design that builds trust
- **Docker Ready**: Containerized for easy deployment and development
- **Modern Tech Stack**: Built with Vite, vanilla JavaScript, and modern CSS

## 🏥 Key Sections

- **Hero Section**: Compelling value proposition with statistics
- **Features**: Comprehensive overview of AI assistant capabilities
- **Benefits**: ROI-focused benefits for veterinary practices
- **Interactive Demo**: Three scenarios (appointments, emergencies, prescriptions)
- **Pricing**: Transparent pricing tiers for different clinic sizes
- **Testimonials**: Social proof from veterinary professionals
- **Contact Form**: Lead generation and demo scheduling

## 🛠️ Technology Stack

- **Frontend**: Vite + Vanilla JavaScript + Modern CSS
- **Styling**: CSS Custom Properties, Flexbox, Grid
- **Containerization**: Docker + Docker Compose
- **Development**: Hot reload, live preview
- **Production**: Nginx for optimized serving

## 🐳 Docker Setup

### Quick Start (Production)
```bash
# Build and run the production version
docker-compose up --build

# Access the website at http://localhost:3000
```

### Development Mode
```bash
# Run development version with hot reload
docker-compose --profile dev up --build

# Access the development server at http://localhost:5173
```

### Manual Docker Commands
```bash
# Build production image
docker build -t pawsistant-web .

# Run production container
docker run -p 3000:80 pawsistant-web

# Build development image
docker build -f Dockerfile.dev -t pawsistant-dev .

# Run development container
docker run -p 5173:5173 -v $(pwd):/app -v /app/node_modules pawsistant-dev
```

## 💻 Local Development

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Docker (optional)

### Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📱 Demo Features

The interactive demo showcases three key scenarios:

1. **Appointment Booking**: Natural conversation flow for scheduling
2. **Emergency Handling**: Immediate triage and escalation protocols  
3. **Prescription Management**: Medication refills and requirement checking

## 🎨 Design System

### Colors
- **Primary**: Blue (#3B82F6) - Trust and professionalism
- **Secondary**: Green (#10B981) - Health and growth
- **Neutrals**: Gray scale for text and backgrounds

### Typography
- **Font**: Inter - Clean, professional, highly readable
- **Hierarchy**: Clear heading structure with appropriate sizing

### Components
- Responsive navigation with mobile hamburger menu
- Interactive buttons with hover states and animations
- Professional cards with consistent styling
- Modern form inputs with focus states

## 🚀 Deployment

### Production Deployment
The Docker setup is production-ready with:
- Multi-stage build for optimized image size
- Nginx for efficient static file serving
- Gzip compression enabled
- Proper caching headers
- Health checks and restart policies

### Environment Variables
No environment variables required for basic functionality. The demo is self-contained.

## 🔮 Future AI Integration

The website is designed for easy integration with VAPI (Voice AI Platform):

- Demo interface can be connected to real AI assistant
- Contact forms structured for lead qualification
- Event tracking ready for analytics
- Modular JavaScript for API integration

## 📊 Analytics & Performance

- Optimized for Core Web Vitals
- SEO-friendly structure with semantic HTML
- Accessible design following WCAG guidelines
- Performance monitoring ready

## 🤝 Contributing

This is a demo website for showcasing AI call assistant capabilities. For actual implementation or customization for your veterinary clinic, contact the development team.

## 📞 Contact

For inquiries about implementing Pawsistant for your veterinary clinic:
- Email: hello@pawsistant.com
- Phone: 1-800-PAWSIST
- Website: [Demo Link]

## 📄 License

This project is designed as a professional demo for Pawsistant AI call assistant services.

---

**Built with ❤️ for veterinary professionals who want to focus on animal care, not phone calls.**
