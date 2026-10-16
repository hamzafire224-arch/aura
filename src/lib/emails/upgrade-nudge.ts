export const upgradeNudgeEmail = ({
    firstName,
    creditsUsed,
    creditsTotal,
    upgradUrl
}: {
    firstName: string
    creditsUsed: number
    creditsTotal: number
    upgradUrl: string
}) => `
<!DOCTYPE html>
<html>
<body>
  <div class="container">
    <h1>You're crushing it, ${firstName}! 💪</h1>
    
    <p>You've used ${creditsUsed}/${creditsTotal} AI credits this month. That's amazing progress!</p>
    
    <div class="highlight-box">
      <h3>Ready to unlock unlimited potential?</h3>
      <p>Upgrade to Pro and get:</p>
      <ul>
        <li>✅ 500 AI credits/month (vs 10 on free)</li>
        <li>✅ Unlimited businesses (vs 1)</li>
        <li>✅ Advanced analytics</li>
        <li>✅ Priority support</li>
      </ul>
    </div>
    
    <p><strong>Special offer: 20% off your first month</strong></p>
    <p>Use code: <code>CRUSH20</code></p>
    
    <a href="${upgradUrl}" class="cta-button">Upgrade to Pro - $39 (was $49)</a>
    
    <p style="font-size: 14px; color: #718096;">
      This offer expires in 24 hours. Don't miss out!
    </p>
  </div>
</body>
</html>
`
