import React, { useState } from 'react';
import { GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';
import Login from './components/LoginComp'; // The login component we created earlier
import { Game } from './screens/Game'; // Your existing Game component

const GameWrapper: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);

  const handleLoginSuccess = (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {
    setIsLoggedIn(true);
    if ('profileObj' in response) {
      setUser(response.profileObj);
    }
  };

  const handleLoginFailure = (error: any) => {
    console.error('Login failed:', error);
  };

  if (!isLoggedIn) {
    return <Login onLoginSuccess={handleLoginSuccess} onLoginFailure={handleLoginFailure} />;
  }

  return <Game user = {user}/>;
};

export default GameWrapper;