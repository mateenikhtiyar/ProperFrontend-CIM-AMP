'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function VerifyEmailSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get('token');
  const role = searchParams.get('role');

  useEffect(() => {
    if (token && role) {
      localStorage.setItem('access_token', token);
    } else {
      router.push('/verify-email-failure');
    }
  }, [token, role, router]);

  const handleContinue = () => {
    if (role === 'buyer') {
      router.push('/buyer/acquireprofile'); // Redirect buyer to acquireprofile
    } else if (role === 'seller') {
      router.push('/seller/dashboard'); // Redirect seller to seller dashboard
    } else {
      router.push('/login'); // Fallback
    }
  };

  if (!token || !role) {
    return null; // Or a loading spinner, or redirect immediately if no token/role
  }

  return (
    <div style={{ fontFamily: 'sans-serif', textAlign: 'center', padding: '20px' }}>
      <img src="/illustration.png" alt="CIM Amplify Logo" style={{ maxWidth: '150px', margin: '20px auto' }} />
      <h1 style={{ color: '#3aafa9' }}>Email Verification Complete</h1>
      <p>Thank you! Your email has been successfully verified.</p>

      <button
        onClick={handleContinue}
        style={{
          backgroundColor: '#3aafa9',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginTop: '20px',
        }}
      >
        Continue to Dashboard
      </button>

      <div style={{ border: '1px solid #eee', padding: '20px', margin: '40px auto', maxWidth: '600px', textAlign: 'left' }}>
        <h2>Important: Ensure you receive our emails!</h2>
        <p>Please check your spam/junk folder and mark it as not junk. All emails to you will come from this email address.</p>

        <h3>Subject: CIM Amplify Verification</h3>

        <p>Body:</p>
        <p>Hello [Your Name],</p>
        <p>Thank you for registering on CIM Amplify!</p>
        <p>Spam filters have become incredibly aggressive and we don’t want you to miss any communications from us about deals - only deals, we promise. Even if you didn’t find this message in your spam folder we strongly suggest that you add our domain, cimamplify.com, to your safe senders list.</p>

        <p>Below are very simple instructions from your email provider on how to add cimamplify.com to your safe sender list:</p>

        <h4>Microsoft Outlook.com</h4>
        <h4>Microsoft Outlook Desktop</h4>

        <h4>Google Workspace</h4>
        <ul style={{ listStyleType: 'disc', marginLeft: '20px' }}>
            <li>Access Gmail Settings: Log in to your Gmail account and click the gear icon, then select "See all settings".</li>
            <li>Navigate to Filters and Blocked Addresses: Click on the "Filters and Blocked Addresses" tab.</li>
            <li>Create a New Filter: Click "Create a new filter".</li>
            <li>Specify the Sender: In the "From" field, enter *@cimamplify.com</li>
            <li>Create the Filter: Click "Create filter".</li>
            <li>Bypass Spam: Check the box next to "Never send it to Spam" and then click "Create filter" again to save the changes.</li>
        </ul>

        <p>Once you have added cimamplify.com to your safe sender’s list click here to confirm with CIM Amplify</p>
        <p>Thank you,<br />The CIM Amplify Team</p>
      </div>

      <p style={{ marginTop: '50px', fontSize: '0.8em', color: '#6b7280' }}>
        © 2025 CIM Amplify. All rights reserved.
      </p>
    </div>
  );
}