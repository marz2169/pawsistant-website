// Dashboard JavaScript - Pawsistant AI Assistant
class DashboardManager {
    constructor() {
        this.calls = [];
        this.appointments = [];
        this.currentView = 'table';
        this.sortColumn = 'start';
        this.sortDirection = 'desc';
        
        this.init();
        this.loadSampleData();
    }
    
    init() {
        // Event listeners
        document.getElementById('search-input').addEventListener('input', (e) => {
            this.filterCalls(e.target.value);
        });
        
        document.getElementById('resolution-filter').addEventListener('change', () => {
            this.applyFilters();
        });
        
        document.getElementById('outcome-filter').addEventListener('change', () => {
            this.applyFilters();
        });
        
        document.getElementById('refresh-data').addEventListener('click', () => {
            this.refreshData();
        });
        
        document.getElementById('date-filter').addEventListener('change', () => {
            this.filterByDate();
        });
        
        // View switcher
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchView(e.target.dataset.view);
            });
        });
        
        // Table sorting
        document.querySelectorAll('.sortable').forEach(th => {
            th.addEventListener('click', (e) => {
                const column = e.target.dataset.sort;
                this.sortTable(column);
            });
        });
        
        // Modal
        document.getElementById('modal-close').addEventListener('click', () => {
            this.closeModal();
        });
        
        // Set today's date as default
        document.getElementById('date-filter').valueAsDate = new Date();
    }
    
    loadSampleData() {
        // Sample call data that matches your veterinary clinic scenario
        this.calls = [
            {
                id: '1',
                caller: '+14960731222',
                name: 'Robert Johnson',
                start: new Date('2025-08-09T21:50:00'),
                duration: '3:41',
                status: 'ended',
                endReason: 'assistant-ended-call',
                outcomes: ['new-patient-registered', 'appointment-scheduled'],
                appointmentDetails: {
                    date: '2025-08-12',
                    time: '10:30 AM',
                    service: 'Annual Checkup',
                    petName: 'Buddy',
                    petType: 'Golden Retriever'
                },
                transcript: 'Customer called to schedule an appointment for their dog Buddy. Assistant collected all necessary information and scheduled an annual checkup.',
                notes: 'New patient registration completed. Owner mentioned Buddy is 3 years old and needs vaccinations.'
            },
            {
                id: '2',
                caller: '+13554102309',
                name: 'Emily Taylor',
                start: new Date('2025-08-09T19:35:00'),
                duration: '3:04',
                status: 'ended',
                endReason: 'assistant-forwarded-call',
                outcomes: ['appointment-scheduled'],
                appointmentDetails: {
                    date: '2025-08-10',
                    time: '2:15 PM',
                    service: 'Emergency Visit',
                    petName: 'Whiskers',
                    petType: 'Persian Cat'
                },
                transcript: 'Emergency call regarding cat not eating. Assistant scheduled urgent appointment and forwarded to on-call veterinarian.',
                notes: 'Urgent case - Cat not eating for 2 days. Forwarded to Dr. Smith for immediate attention.'
            },
            {
                id: '3',
                caller: '+13238514128',
                name: 'Robert Perez',
                start: new Date('2025-08-09T13:33:00'),
                duration: '2:44',
                status: 'ended',
                endReason: 'customer-ended-call',
                outcomes: ['new-patient-registered', 'appointment-scheduled'],
                appointmentDetails: {
                    date: '2025-08-11',
                    time: '9:00 AM',
                    service: 'Dental Cleaning',
                    petName: 'Max',
                    petType: 'German Shepherd'
                },
                transcript: 'Customer inquired about dental services. Assistant provided information and scheduled dental cleaning appointment.',
                notes: 'New client with 5-year-old German Shepherd. Interested in dental care program.'
            },
            {
                id: '4',
                caller: '+17545166906',
                name: 'Jessica Perry',
                start: new Date('2025-08-09T12:45:00'),
                duration: '2:21',
                status: 'ended',
                endReason: 'customer-ended-call',
                outcomes: ['appointment-cancelled'],
                appointmentDetails: null,
                transcript: 'Customer called to cancel existing appointment due to travel plans.',
                notes: 'Cancelled appointment for 8/10. Customer will reschedule upon return from vacation.'
            },
            {
                id: '5',
                caller: '+15335742476',
                name: 'Alexander Jenkins',
                start: new Date('2025-08-09T09:57:00'),
                duration: '2:59',
                status: 'ended',
                endReason: 'assistant-forwarded-call',
                outcomes: ['new-patient-registered', 'appointment-scheduled'],
                appointmentDetails: {
                    date: '2025-08-13',
                    time: '11:45 AM',
                    service: 'Vaccination',
                    petName: 'Luna',
                    petType: 'Border Collie'
                },
                transcript: 'New patient registration for puppy vaccinations. Assistant collected all required information.',
                notes: 'New puppy - 4 months old Border Collie. Needs full vaccination series.'
            },
            {
                id: '6',
                caller: '+18072656230',
                name: 'Ryan Wilson',
                start: new Date('2025-08-09T08:44:00'),
                duration: '2:31',
                status: 'ended',
                endReason: 'customer-ended-call',
                outcomes: ['new-patient-registered'],
                appointmentDetails: null,
                transcript: 'Customer inquired about services and pricing. Provided information but no appointment scheduled.',
                notes: 'Interested in spay/neuter services. Will call back to schedule after consulting with family.'
            },
            {
                id: '7',
                caller: '+13043124470',
                name: 'Elizabeth Bell',
                start: new Date('2025-08-09T07:06:00'),
                duration: '2:20',
                status: 'ended',
                endReason: 'customer-ended-call',
                outcomes: ['new-patient-registered', 'appointment-scheduled'],
                appointmentDetails: {
                    date: '2025-08-14',
                    time: '3:30 PM',
                    service: 'Surgery Consultation',
                    petName: 'Charlie',
                    petType: 'Mixed Breed'
                },
                transcript: 'Customer needs consultation for potential surgery. Assistant scheduled consultation appointment.',
                notes: 'Dog has growth that needs evaluation. Scheduled with Dr. Martinez for surgical consultation.'
            },
            {
                id: '8',
                caller: '+18271776592',
                name: 'Jacob Phillips',
                start: new Date('2025-08-09T02:01:00'),
                duration: '2:51',
                status: 'ended',
                endReason: 'assistant-ended-call',
                outcomes: ['appointment-rescheduled'],
                appointmentDetails: {
                    date: '2025-08-15',
                    time: '1:00 PM',
                    service: 'Follow-up Visit',
                    petName: 'Bella',
                    petType: 'Labrador'
                },
                transcript: 'Customer needed to reschedule existing appointment due to work conflict.',
                notes: 'Moved appointment from 8/12 to 8/15. Follow-up for recent illness.'
            }
        ];
        
        // Extract appointments from calls
        this.appointments = this.calls
            .filter(call => call.appointmentDetails)
            .map(call => ({
                id: call.id,
                ...call.appointmentDetails,
                caller: call.caller,
                name: call.name,
                status: call.outcomes.includes('appointment-cancelled') ? 'cancelled' : 
                       call.outcomes.includes('appointment-rescheduled') ? 'rescheduled' : 'scheduled'
            }));
            
        this.renderTable();
        this.updateStats();
    }
    
    renderTable() {
        const tbody = document.getElementById('calls-table-body');
        tbody.innerHTML = '';
        
        this.calls.forEach(call => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <div class="caller-info">
                        <div class="caller-phone">${call.caller}</div>
                        <div class="caller-name">${call.name}</div>
                    </div>
                </td>
                <td class="call-time">${this.formatTime(call.start)}</td>
                <td class="call-duration">${call.duration}</td>
                <td>
                    <span class="status-badge ${call.status}">
                        <span class="status-indicator"></span>
                        ${call.status}
                    </span>
                </td>
                <td>
                    <span class="end-reason">${call.endReason.replace(/-/g, ' ')}</span>
                </td>
                <td>
                    <div class="outcome-badges">
                        ${call.outcomes.map(outcome => `
                            <span class="outcome-badge ${outcome}">
                                ${this.formatOutcome(outcome)}
                            </span>
                        `).join('')}
                    </div>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn" onclick="dashboard.viewCallDetails('${call.id}')" title="View Details">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2"/>
                                <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
                            </svg>
                        </button>
                        <button class="action-btn" onclick="dashboard.copyCallInfo('${call.id}')" title="Copy Info">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" stroke-width="2"/>
                            </svg>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    }
    
    renderAppointments() {
        const grid = document.getElementById('appointments-grid');
        grid.innerHTML = '';
        
        this.appointments.forEach(appointment => {
            const card = document.createElement('div');
            card.className = 'appointment-card';
            card.innerHTML = `
                <div class="appointment-header">
                    <div>
                        <div class="appointment-time">${appointment.time}</div>
                        <div class="appointment-date">${this.formatDate(appointment.date)}</div>
                    </div>
                    <span class="outcome-badge ${appointment.status === 'cancelled' ? 'appointment-cancelled' : 
                                                   appointment.status === 'rescheduled' ? 'appointment-rescheduled' : 
                                                   'appointment-scheduled'}">
                        ${appointment.status}
                    </span>
                </div>
                <div class="appointment-patient">
                    <div class="patient-name">${appointment.name}</div>
                    <div class="patient-phone">${appointment.caller}</div>
                </div>
                <div class="appointment-details">
                    <div class="detail-item">
                        <span class="detail-label">Pet:</span>
                        <span class="detail-value">${appointment.petName} (${appointment.petType})</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Service:</span>
                        <span class="detail-value">${appointment.service}</span>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });
    }
    
    switchView(view) {
        this.currentView = view;
        
        // Update active button
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });
        
        // Show/hide views
        const tableSection = document.querySelector('.table-section');
        const appointmentsSection = document.getElementById('appointments-view');
        
        if (view === 'appointments') {
            tableSection.style.display = 'none';
            appointmentsSection.style.display = 'block';
            this.renderAppointments();
        } else {
            tableSection.style.display = 'block';
            appointmentsSection.style.display = 'none';
        }
    }
    
    sortTable(column) {
        if (this.sortColumn === column) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = column;
            this.sortDirection = 'asc';
        }
        
        // Update sort indicators
        document.querySelectorAll('.sortable').forEach(th => {
            th.classList.remove('sorted', 'asc', 'desc');
        });
        
        const currentTh = document.querySelector(`[data-sort="${column}"]`);
        currentTh.classList.add('sorted', this.sortDirection);
        
        // Sort data
        this.calls.sort((a, b) => {
            let aVal, bVal;
            
            switch (column) {
                case 'caller':
                    aVal = a.name.toLowerCase();
                    bVal = b.name.toLowerCase();
                    break;
                case 'start':
                    aVal = a.start;
                    bVal = b.start;
                    break;
                case 'duration':
                    aVal = this.parseDuration(a.duration);
                    bVal = this.parseDuration(b.duration);
                    break;
                default:
                    aVal = a[column];
                    bVal = b[column];
            }
            
            if (aVal < bVal) return this.sortDirection === 'asc' ? -1 : 1;
            if (aVal > bVal) return this.sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
        
        this.renderTable();
    }
    
    applyFilters() {
        const resolutionFilter = document.getElementById('resolution-filter').value;
        const outcomeFilter = document.getElementById('outcome-filter').value;
        const searchTerm = document.getElementById('search-input').value.toLowerCase();
        
        let filteredCalls = this.calls;
        
        if (resolutionFilter) {
            filteredCalls = filteredCalls.filter(call => 
                call.outcomes.some(outcome => outcome.includes(resolutionFilter))
            );
        }
        
        if (outcomeFilter) {
            filteredCalls = filteredCalls.filter(call => call.endReason === outcomeFilter);
        }
        
        if (searchTerm) {
            filteredCalls = filteredCalls.filter(call => 
                call.name.toLowerCase().includes(searchTerm) ||
                call.caller.includes(searchTerm)
            );
        }
        
        // Temporarily update calls for rendering
        const originalCalls = this.calls;
        this.calls = filteredCalls;
        this.renderTable();
        this.calls = originalCalls;
    }
    
    filterCalls(searchTerm) {
        this.applyFilters();
    }
    
    filterByDate() {
        const selectedDate = new Date(document.getElementById('date-filter').value);
        // For demo purposes, we'll just refresh the data
        // In a real app, this would filter by the selected date
        this.refreshData();
    }
    
    refreshData() {
        // Simulate data refresh with loading state
        const refreshBtn = document.getElementById('refresh-data');
        refreshBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" class="animate-spin">
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" stroke="currentColor" stroke-width="2"/>
                <path d="M21 3v5h-5" stroke="currentColor" stroke-width="2"/>
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" stroke="currentColor" stroke-width="2"/>
                <path d="M8 16H3v5" stroke="currentColor" stroke-width="2"/>
            </svg>
            Refreshing...
        `;
        
        setTimeout(() => {
            refreshBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" stroke="currentColor" stroke-width="2"/>
                    <path d="M21 3v5h-5" stroke="currentColor" stroke-width="2"/>
                    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" stroke="currentColor" stroke-width="2"/>
                    <path d="M8 16H3v5" stroke="currentColor" stroke-width="2"/>
                </svg>
                Refresh
            `;
            this.loadSampleData();
        }, 1000);
    }
    
    viewCallDetails(callId) {
        const call = this.calls.find(c => c.id === callId);
        if (!call) return;
        
        const modalBody = document.getElementById('modal-body');
        modalBody.innerHTML = `
            <div style="margin-bottom: 1.5rem;">
                <h4 style="margin-bottom: 0.5rem; color: var(--text-primary);">Call Information</h4>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div>
                        <strong>Caller:</strong> ${call.name}<br>
                        <strong>Phone:</strong> ${call.caller}<br>
                        <strong>Start Time:</strong> ${this.formatTime(call.start)}<br>
                        <strong>Duration:</strong> ${call.duration}
                    </div>
                    <div>
                        <strong>Status:</strong> ${call.status}<br>
                        <strong>End Reason:</strong> ${call.endReason.replace(/-/g, ' ')}<br>
                        <strong>Outcomes:</strong><br>
                        ${call.outcomes.map(outcome => `• ${this.formatOutcome(outcome)}`).join('<br>')}
                    </div>
                </div>
            </div>
            
            ${call.appointmentDetails ? `
            <div style="margin-bottom: 1.5rem;">
                <h4 style="margin-bottom: 0.5rem; color: var(--text-primary);">Appointment Details</h4>
                <div style="background: var(--bg-accent); padding: 1rem; border-radius: var(--radius-md);">
                    <strong>Date:</strong> ${this.formatDate(call.appointmentDetails.date)}<br>
                    <strong>Time:</strong> ${call.appointmentDetails.time}<br>
                    <strong>Service:</strong> ${call.appointmentDetails.service}<br>
                    <strong>Pet:</strong> ${call.appointmentDetails.petName} (${call.appointmentDetails.petType})
                </div>
            </div>
            ` : ''}
            
            <div style="margin-bottom: 1.5rem;">
                <h4 style="margin-bottom: 0.5rem; color: var(--text-primary);">Call Transcript</h4>
                <div style="background: var(--bg-accent); padding: 1rem; border-radius: var(--radius-md); font-style: italic;">
                    "${call.transcript}"
                </div>
            </div>
            
            <div>
                <h4 style="margin-bottom: 0.5rem; color: var(--text-primary);">Notes</h4>
                <div style="background: var(--bg-accent); padding: 1rem; border-radius: var(--radius-md);">
                    ${call.notes}
                </div>
            </div>
        `;
        
        document.getElementById('call-details-modal').classList.add('show');
    }
    
    copyCallInfo(callId) {
        const call = this.calls.find(c => c.id === callId);
        if (!call) return;
        
        const callInfo = `
Call Details:
Caller: ${call.name} (${call.caller})
Time: ${this.formatTime(call.start)}
Duration: ${call.duration}
Status: ${call.status}
End Reason: ${call.endReason.replace(/-/g, ' ')}
Outcomes: ${call.outcomes.map(o => this.formatOutcome(o)).join(', ')}

${call.appointmentDetails ? `Appointment:
Date: ${this.formatDate(call.appointmentDetails.date)}
Time: ${call.appointmentDetails.time}
Service: ${call.appointmentDetails.service}
Pet: ${call.appointmentDetails.petName} (${call.appointmentDetails.petType})

` : ''}Notes: ${call.notes}
        `.trim();
        
        navigator.clipboard.writeText(callInfo).then(() => {
            // Show success message
            const btn = event.target.closest('.action-btn');
            const originalHTML = btn.innerHTML;
            btn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <polyline points="20,6 9,17 4,12" stroke="currentColor" stroke-width="2"/>
                </svg>
            `;
            btn.style.background = 'var(--status-success)';
            btn.style.color = 'white';
            
            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.style.background = '';
                btn.style.color = '';
            }, 2000);
        });
    }
    
    closeModal() {
        document.getElementById('call-details-modal').classList.remove('show');
    }
    
    updateStats() {
        const today = new Date().toDateString();
        const todayCalls = this.calls.filter(call => call.start.toDateString() === today);
        
        document.getElementById('total-calls').textContent = todayCalls.length;
        document.getElementById('appointments-booked').textContent = 
            todayCalls.filter(call => call.outcomes.includes('appointment-scheduled')).length;
        document.getElementById('new-patients').textContent = 
            todayCalls.filter(call => call.outcomes.includes('new-patient-registered')).length;
        
        const avgDuration = this.calculateAverageDuration(todayCalls);
        document.getElementById('avg-duration').textContent = avgDuration;
    }
    
    // Utility functions
    formatTime(date) {
        return date.toLocaleString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    }
    
    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    
    formatOutcome(outcome) {
        return outcome.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    
    parseDuration(duration) {
        const [minutes, seconds] = duration.split(':').map(Number);
        return minutes * 60 + seconds;
    }
    
    calculateAverageDuration(calls) {
        if (calls.length === 0) return '0:00';
        
        const totalSeconds = calls.reduce((sum, call) => {
            return sum + this.parseDuration(call.duration);
        }, 0);
        
        const avgSeconds = Math.round(totalSeconds / calls.length);
        const minutes = Math.floor(avgSeconds / 60);
        const seconds = avgSeconds % 60;
        
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
}

// VAPI Integration Functions
class VAPIIntegration {
    constructor() {
        this.apiKey = 'YOUR_VAPI_API_KEY'; // Replace with your actual VAPI API key
        this.assistantId = 'YOUR_ASSISTANT_ID'; // Replace with your assistant ID
    }
    
    // Function to receive webhook data from VAPI
    handleVAPIWebhook(webhookData) {
        console.log('VAPI Webhook received:', webhookData);
        
        // Parse the webhook data and extract appointment information
        if (webhookData.type === 'call-ended' && webhookData.appointment) {
            this.addNewCall(webhookData);
            dashboard.loadSampleData(); // Refresh dashboard
        }
    }
    
    // Add new call from VAPI webhook
    addNewCall(webhookData) {
        const newCall = {
            id: webhookData.callId || Date.now().toString(),
            caller: webhookData.customer?.phone || 'Unknown',
            name: webhookData.customer?.name || 'Unknown Caller',
            start: new Date(webhookData.startTime),
            duration: this.formatDuration(webhookData.duration || 0),
            status: 'ended',
            endReason: webhookData.endReason || 'assistant-ended-call',
            outcomes: this.extractOutcomes(webhookData),
            appointmentDetails: webhookData.appointment || null,
            transcript: webhookData.transcript || 'No transcript available',
            notes: webhookData.summary || 'No additional notes'
        };
        
        // Add to dashboard
        dashboard.calls.unshift(newCall);
        dashboard.renderTable();
        dashboard.updateStats();
    }
    
    // Extract outcomes from VAPI data
    extractOutcomes(webhookData) {
        const outcomes = [];
        
        if (webhookData.newPatient) outcomes.push('new-patient-registered');
        if (webhookData.appointment) outcomes.push('appointment-scheduled');
        if (webhookData.cancelled) outcomes.push('appointment-cancelled');
        if (webhookData.rescheduled) outcomes.push('appointment-rescheduled');
        
        return outcomes.length > 0 ? outcomes : ['no-action'];
    }
    
    formatDuration(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
}

// Initialize dashboard and VAPI integration
let dashboard;
let vapiIntegration;

document.addEventListener('DOMContentLoaded', () => {
    dashboard = new DashboardManager();
    vapiIntegration = new VAPIIntegration();
    
    // Close modal when clicking outside
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            dashboard.closeModal();
        }
    });
    
    // Handle escape key for modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            dashboard.closeModal();
        }
    });
});

// Export functions for VAPI webhook integration
window.handleVAPIWebhook = (data) => vapiIntegration.handleVAPIWebhook(data);

// Simulate receiving VAPI webhooks (for testing)
function simulateVAPICall() {
    const sampleWebhook = {
        type: 'call-ended',
        callId: 'test-' + Date.now(),
        customer: {
            phone: '+1555' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0'),
            name: 'Test Customer'
        },
        startTime: new Date().toISOString(),
        duration: Math.floor(Math.random() * 300) + 60, // 1-6 minutes
        endReason: 'assistant-ended-call',
        newPatient: Math.random() > 0.5,
        appointment: Math.random() > 0.3 ? {
            date: new Date(Date.now() + Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            time: Math.floor(Math.random() * 8 + 9) + ':00 AM',
            service: ['Annual Checkup', 'Vaccination', 'Dental Cleaning', 'Emergency Visit'][Math.floor(Math.random() * 4)],
            petName: ['Buddy', 'Max', 'Luna', 'Charlie', 'Bella'][Math.floor(Math.random() * 5)],
            petType: ['Dog', 'Cat', 'Rabbit'][Math.floor(Math.random() * 3)]
        } : null,
        transcript: 'Customer called to schedule an appointment. All information collected successfully.',
        summary: 'Successful call with appointment booking.'
    };
    
    vapiIntegration.handleVAPIWebhook(sampleWebhook);
}

// Add test button (for development)
setTimeout(() => {
    const testBtn = document.createElement('button');
    testBtn.textContent = 'Simulate VAPI Call (Test)';
    testBtn.style.position = 'fixed';
    testBtn.style.bottom = '20px';
    testBtn.style.right = '20px';
    testBtn.style.padding = '10px 15px';
    testBtn.style.background = '#7f5af0';
    testBtn.style.color = 'white';
    testBtn.style.border = 'none';
    testBtn.style.borderRadius = '5px';
    testBtn.style.cursor = 'pointer';
    testBtn.style.zIndex = '1000';
    testBtn.onclick = simulateVAPICall;
    document.body.appendChild(testBtn);
}, 1000);
