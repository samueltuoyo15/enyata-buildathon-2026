import { Zap } from "lucide-react";
import Link from "next/link";
import Card from "@/app/components/Card";
import OAuthButton from "@/app/components/OAuthButton";
import { signInWithGoogle } from "@/app/actions/auth";

export default function Login() {
 return (
  <form className="bg-gradient-mesh min-h-[80vh] flex items-center justify-center px-8">
   <Card className="w-full max-w-[400px] flex flex-col items-center gap-8">
    <div className="flex flex-col justify-center items-center text-center gap-2">
     <Zap
      size={48}
      color="var(--color-text-main)"
      fill="var(--color-primary)"
     />
     <h1 className="text-4xl font-black">Welcome Back</h1>
     <p className="font-medium text-text-muted text-center">
      Sign in to access the SendLess Routing Engine
     </p>
    </div>

    <OAuthButton action={signInWithGoogle} />

    <div className="text-sm font-medium">
     <Link href="/" className="underline">
      Return to home
     </Link>
    </div>
   </Card>
  </form>
 );
}
