export const welcomeEmail = ({
    firstName,
    dashboardUrl,
    videoUrl
}: {
    firstName: string
    dashboardUrl: string
    videoUrl: string
}) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Inter', sans-serif; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px; }
    .header { text-align: center; margin-bottom: 32px; }
    .logo { width: 120px; }
    h1 { color: #1a1a1a; font-size: 28px; margin-bottom: 16px; }
    p { color: #4a5568; font-size: 16px; line-height: 1.6; }
    .steps { background: #f7fafc; border-radius: 8px; padding: 24px; margin: 24px 0; }
    .step { display: flex; margin-bottom: 20px; }
    .step-number { 
      background: #667eea; 
      color: white; 
      width: 32px; 
      height: 32px; 
      border-radius: 50%; 
      display: flex; 
      align-items: center; 
      justify-content: center;
      margin-right: 16px;
      flex-shrink: 0;
    }
    .cta-button {
      display: inline-block;
      background: #667eea;
      color: white;
      padding: 16px 32px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      margin: 24px 0;
    }
    .footer { 
      border-top: 1px solid #e2e8f0; 
      padding-top: 24px; 
      margin-top: 32px; 
      text-align: center; 
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://aura.ai/logo.png" alt="AURA" class="logo" />
    </div>
    
    <h1>Welcome to AURA, ${firstName}! 👋</h1>
    
    <p>You just joined 1,247 entrepreneurs building their dream businesses with AI. Here's how to get the most out of AURA:</p>
    
    <div class="steps">
      <div class="step">
        <div class="step-number">1</div>
        <div>
          <h3>Create Your First Business</h3>
          <p>Takes just 60 seconds. Watch AI build your empire.</p>
        </div>
      </div>
      
      <div class="step">
        <div class="step-number">2</div>
        <div>
          <h3>Generate Your First Content</h3>
          <p>Let AI create 30 days of social posts in 5 minutes.</p>
        </div>
      </div>
      
      <div class="step">
        <div class="step-number">3</div>
        <div>
          <h3>Track Your Growth</h3>
          <p>Watch real-time analytics as you grow.</p>
        </div>
      </div>
    </div>
    
    <a href="${dashboardUrl}" class="cta-button">Go to Dashboard</a>
    
    <p>👉 Watch this 2-minute video to see AURA in action:</p>
    <a href="${videoUrl}">
      <img src="https://aura.ai/video-thumbnail.jpg" alt="Watch Demo" style="width: 100%; border-radius: 8px;" />
    </a>
    
    <div class="footer">
      <p style="color: #718096; font-size: 14px;">
        Need help? We're here for you:<br/>
        📧 support@aura.ai | 💬 Live chat in dashboard
      </p>
      <p style="color: #a0aec0; font-size: 12px; margin-top: 16px;">
        AURA Technologies © 2025<br/>
        Made with ❤️ in Pakistan
      </p>
    </div>
  </div>
</body>
</html>
`
