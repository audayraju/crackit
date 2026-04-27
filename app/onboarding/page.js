"use client";
import ProfileSetup from "../../components/ProfileSetup";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const router = useRouter();
  
  const handleComplete = () => {
    router.push("/dashboard");
  };
  
  return <ProfileSetup onComplete={handleComplete} />;
}
