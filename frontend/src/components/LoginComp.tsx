import React, { useState } from 'react';
import { GoogleLogin, GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';

import web from '../../../client_secret.json';

const clientId = web.web.client_id;



interface LoginProps {
  onLoginSuccess: (response: GoogleLoginResponse | GoogleLoginResponseOffline) => void;
  onLoginFailure: (error: any) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess, onLoginFailure }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSuccess = (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {
    setIsLoading(false);
    onLoginSuccess(response);
  };

  const handleLoginFailure = (error: any) => {
    setIsLoading(false);
    onLoginFailure(error);
  };

  return (
    <div className="login-container">
      <h2>Login with Gmail</h2>
      <GoogleLogin
        clientId={clientId}
        buttonText="Login with Google"
        onSuccess={handleLoginSuccess}
        onFailure={handleLoginFailure}
        cookiePolicy={'single_host_origin'}
        isSignedIn={true}
        onRequest={() => setIsLoading(true)}
        disabled={isLoading}
      />
      {isLoading && <p>Logging in...</p>}
    </div>
  );
};

export default Login;