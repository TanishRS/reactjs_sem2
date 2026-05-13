import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SignInPage } from '../components/ui/sign-in';
import { BackgroundGradientAnimation } from '../components/ui/background-gradient-animation';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // After login, redirect to the page the user was trying to visit, or home.
  const from = location.state?.from || '/';

  function handleSignIn(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email') || 'Student';
    login(email, 'student');
    navigate(from, { replace: true });
  }

  function handleGoogleSignIn() {
    login('Demo User', 'student');
    navigate(from, { replace: true });
  }

  return (
    <SignInPage 
      title={<span className="font-bold text-white tracking-tighter">CampusEvent</span>}
      description="Sign in to browse, register, and host your own events."
      onSignIn={handleSignIn}
      onGoogleSignIn={handleGoogleSignIn}
      heroContent={
        <BackgroundGradientAnimation
          gradientBackgroundStart="rgb(24, 24, 27)"
          gradientBackgroundEnd="rgb(9, 9, 11)"
          firstColor="63, 63, 70"
          secondColor="82, 82, 91"
          thirdColor="113, 113, 122"
          fourthColor="39, 39, 42"
          fifthColor="161, 161, 170"
          pointerColor="212, 212, 216"
          containerClassName="absolute inset-0 h-full w-full"
        />
      }
      testimonials={[
        {
          name: "Alex Johnson",
          handle: "@alexj",
          text: "CampusEvent makes it so easy to keep track of all the workshops!",
          avatarSrc: "https://i.pravatar.cc/150?u=a042581f4e29026024d"
        },
        {
          name: "Sarah Smith",
          handle: "@sarahs",
          text: "I found the best hackathons using this app. Love the sleek new design.",
          avatarSrc: "https://i.pravatar.cc/150?u=a04258a2462d826712d"
        }
      ]}
    />
  );
}
