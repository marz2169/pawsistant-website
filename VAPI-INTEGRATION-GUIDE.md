# 🚀 VAPI Integration Guide for Pawsistant Dashboard

## Overview
This guide shows how to integrate your Pawsistant AI assistant with VAPI (Voice AI API) to automatically capture appointment bookings and display them in your custom dashboard.

## 🔧 VAPI Setup Steps

### 1. Create VAPI Assistant
```javascript
// Your VAPI Assistant Configuration
{
  "name": "Pawsistant Veterinary Assistant",
  "model": "gpt-4",
  "voice": "jennifer", // or your preferred voice
  "firstMessage": "Hi! I'm Pawsistant, your AI assistant for [Clinic Name]. How can I help you today?",
  "systemPrompt": `You are Pawsistant, an AI assistant for a veterinary clinic. Your role is to:
  
  1. Answer questions about services, hours, and pricing
  2. Schedule appointments for pets
  3. Collect patient information for new clients
  4. Handle appointment changes and cancellations
  5. Forward urgent cases to on-call veterinarians
  
  Always be professional, empathetic, and pet-focused. Collect the following for appointments:
  - Owner name and phone number
  - Pet name, type, breed, and age
  - Reason for visit
  - Preferred date and time
  - Any urgent concerns
  
  If it's an emergency, immediately offer to connect to on-call vet.`,
  
  "functions": [
    {
      "name": "schedule_appointment",
      "description": "Schedule a veterinary appointment",
      "parameters": {
        "type": "object",
        "properties": {
          "owner_name": {"type": "string"},
          "phone": {"type": "string"},
          "pet_name": {"type": "string"},
          "pet_type": {"type": "string"},
          "pet_breed": {"type": "string"},
          "pet_age": {"type": "string"},
          "appointment_date": {"type": "string"},
          "appointment_time": {"type": "string"},
          "service_type": {"type": "string"},
          "notes": {"type": "string"}
        },
        "required": ["owner_name", "phone", "pet_name", "appointment_date", "service_type"]
      }
    }
  ]
}
```

### 2. Set Up Webhooks

#### Dashboard Webhook Endpoint
Create a webhook endpoint to receive VAPI call data:

```javascript
// webhook-handler.js (Node.js example)
const express = require('express');
const app = express();

app.post('/vapi-webhook', express.json(), (req, res) => {
  const webhookData = req.body;
  
  // Process the webhook data
  if (webhookData.type === 'function-call' && webhookData.function.name === 'schedule_appointment') {
    const appointmentData = {
      type: 'call-ended',
      callId: webhookData.call.id,
      customer: {
        name: webhookData.function.parameters.owner_name,
        phone: webhookData.function.parameters.phone
      },
      startTime: webhookData.call.startedAt,
      duration: Math.floor((new Date() - new Date(webhookData.call.startedAt)) / 1000),
      endReason: 'assistant-ended-call',
      newPatient: true, // Determine based on your logic
      appointment: {
        date: webhookData.function.parameters.appointment_date,
        time: webhookData.function.parameters.appointment_time,
        service: webhookData.function.parameters.service_type,
        petName: webhookData.function.parameters.pet_name,
        petType: webhookData.function.parameters.pet_type
      },
      transcript: webhookData.call.transcript,
      summary: webhookData.function.parameters.notes || 'Appointment scheduled successfully'
    };
    
    // Send to your dashboard
    updateDashboard(appointmentData);
  }
  
  res.status(200).json({ success: true });
});

function updateDashboard(appointmentData) {
  // This function would update your dashboard
  // You can use WebSockets, Server-Sent Events, or periodic polling
  console.log('New appointment:', appointmentData);
  
  // Example: Send to connected clients via WebSocket
  // wss.clients.forEach(client => {
  //   client.send(JSON.stringify({
  //     type: 'new-appointment',
  //     data: appointmentData
  //   }));
  // });
}
```

### 3. Update Your Main Website VAPI Integration

Replace your current VAPI integration with this enhanced version:

```javascript
// Enhanced VAPI integration with appointment booking
import Vapi from '@vapi-ai/web';

class PawsistantVAPI {
  constructor() {
    this.vapi = new Vapi('YOUR_VAPI_PUBLIC_KEY'); // Replace with your public key
    this.isCallActive = false;
    this.appointmentData = {};
    
    this.setupEventListeners();
  }
  
  setupEventListeners() {
    this.vapi.on('call-start', () => {
      console.log('Call started');
      this.isCallActive = true;
      this.updateUI('connected');
    });
    
    this.vapi.on('call-end', () => {
      console.log('Call ended');
      this.isCallActive = false;
      this.updateUI('disconnected');
    });
    
    this.vapi.on('function-call', (functionCall) => {
      console.log('Function called:', functionCall);
      
      if (functionCall.name === 'schedule_appointment') {
        this.handleAppointmentBooking(functionCall.parameters);
      }
    });
    
    this.vapi.on('message', (message) => {
      console.log('VAPI Message:', message);
      
      if (message.type === 'function-call' && message.function.name === 'schedule_appointment') {
        this.appointmentData = message.function.parameters;
        this.showAppointmentConfirmation();
      }
    });
  }
  
  startCall() {
    if (this.isCallActive) {
      this.vapi.stop();
    } else {
      this.vapi.start('YOUR_ASSISTANT_ID'); // Replace with your assistant ID
    }
  }
  
  handleAppointmentBooking(parameters) {
    this.appointmentData = parameters;
    
    // You can add custom logic here
    console.log('Appointment booked:', parameters);
    
    // Show success message to user
    this.showAppointmentSuccess();
    
    // Optionally, send to your backend
    this.sendAppointmentToBackend(parameters);
  }
  
  showAppointmentSuccess() {
    // Create a success notification
    const notification = document.createElement('div');
    notification.className = 'appointment-success-notification';
    notification.innerHTML = `
      <div class="notification-content">
        <h4>🎉 Appointment Scheduled!</h4>
        <p><strong>${this.appointmentData.pet_name}</strong> is scheduled for <strong>${this.appointmentData.appointment_date}</strong> at <strong>${this.appointmentData.appointment_time}</strong></p>
        <p>Service: ${this.appointmentData.service_type}</p>
        <button onclick="this.parentElement.parentElement.remove()">Close</button>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 10000);
  }
  
  sendAppointmentToBackend(appointmentData) {
    // Send appointment data to your webhook endpoint
    fetch('/api/appointments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'appointment-booked',
        data: appointmentData,
        timestamp: new Date().toISOString()
      })
    }).catch(error => {
      console.log('Could not send to backend:', error);
    });
  }
  
  updateUI(status) {
    const button = document.getElementById('voice-wave-btn');
    if (!button) return;
    
    if (status === 'connected') {
      button.classList.add('active');
      button.innerHTML = `
        <div class="pulse-ring"></div>
        <svg class="voice-icon" viewBox="0 0 24 24" fill="none">
          <path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" fill="currentColor"/>
          <path d="M19 10v1a7 7 0 0 1-14 0v-1" stroke="currentColor" stroke-width="2"/>
          <path d="M12 18v4M8 22h8" stroke="currentColor" stroke-width="2"/>
        </svg>
      `;
    } else {
      button.classList.remove('active');
      button.innerHTML = `
        <svg class="voice-icon" viewBox="0 0 24 24" fill="none">
          <path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" fill="currentColor"/>
          <path d="M19 10v1a7 7 0 0 1-14 0v-1" stroke="currentColor" stroke-width="2"/>
          <path d="M12 18v4M8 22h8" stroke="currentColor" stroke-width="2"/>
        </svg>
      `;
    }
  }
}

// Initialize
const pawsistantVAPI = new PawsistantVAPI();

// Attach to button
document.addEventListener('DOMContentLoaded', () => {
  const voiceButton = document.getElementById('voice-wave-btn');
  if (voiceButton) {
    voiceButton.addEventListener('click', () => {
      pawsistantVAPI.startCall();
    });
  }
});
```

### 4. Dashboard Integration with Live Updates

Add WebSocket support to your dashboard for real-time updates:

```javascript
// Add to dashboard.js
class LiveDashboard extends DashboardManager {
  constructor() {
    super();
    this.connectWebSocket();
  }
  
  connectWebSocket() {
    // Connect to your WebSocket server for live updates
    if (typeof WebSocket !== 'undefined') {
      this.ws = new WebSocket('wss://your-server.com/dashboard-updates');
      
      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        if (data.type === 'new-appointment') {
          this.handleNewAppointment(data.data);
        }
      };
      
      this.ws.onopen = () => {
        console.log('Dashboard connected to live updates');
      };
    }
  }
  
  handleNewAppointment(appointmentData) {
    // Add the new appointment to the dashboard
    const newCall = {
      id: appointmentData.callId || Date.now().toString(),
      caller: appointmentData.customer?.phone || 'Unknown',
      name: appointmentData.customer?.name || 'Unknown Caller',
      start: new Date(appointmentData.startTime),
      duration: this.formatDuration(appointmentData.duration || 0),
      status: 'ended',
      endReason: appointmentData.endReason || 'assistant-ended-call',
      outcomes: ['appointment-scheduled', 'new-patient-registered'],
      appointmentDetails: appointmentData.appointment,
      transcript: appointmentData.transcript || 'Appointment scheduled via AI assistant',
      notes: appointmentData.summary || 'New appointment booking'
    };
    
    // Add to beginning of calls array
    this.calls.unshift(newCall);
    
    // Update UI
    this.renderTable();
    this.updateStats();
    
    // Show notification
    this.showNewAppointmentNotification(newCall);
  }
  
  showNewAppointmentNotification(call) {
    const notification = document.createElement('div');
    notification.className = 'live-notification';
    notification.innerHTML = `
      <div class="notification-header">
        <strong>🔔 New Appointment Booked!</strong>
        <button onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
      <div class="notification-body">
        <p><strong>${call.name}</strong> scheduled an appointment</p>
        <p>📞 ${call.caller}</p>
        ${call.appointmentDetails ? `<p>📅 ${call.appointmentDetails.date} at ${call.appointmentDetails.time}</p>` : ''}
      </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 8000);
  }
}
```

## 🔑 Configuration Checklist

### Required API Keys
1. **VAPI Public Key**: For frontend VAPI Web SDK
2. **VAPI Private Key**: For backend webhook verification
3. **Assistant ID**: Your configured VAPI assistant

### Webhook Configuration
1. Set up webhook endpoint on your server
2. Configure VAPI to send webhooks to your endpoint
3. Handle appointment booking events
4. Update dashboard in real-time

### Dashboard Setup
1. Replace sample data with live data from webhooks
2. Set up WebSocket connection for real-time updates  
3. Configure appointment booking notifications

## 🧪 Testing Your Integration

1. **Test Call Flow**: Use the voice button on your website
2. **Book Appointment**: Have the AI assistant schedule an appointment
3. **Check Dashboard**: Verify the appointment appears in the dashboard
4. **Test Filters**: Ensure dashboard filtering works correctly

## 📱 Next Steps

1. **Production Deployment**: Deploy webhook handler to production server
2. **Database Integration**: Store appointments in database instead of memory
3. **Calendar Integration**: Connect to Google Calendar or similar
4. **SMS Notifications**: Send confirmation texts to customers
5. **Analytics**: Add appointment conversion tracking

This integration creates a seamless flow from voice call → AI booking → dashboard display, giving you complete visibility into your AI assistant's performance! 🚀
