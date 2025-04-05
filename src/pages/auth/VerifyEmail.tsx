import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MailCheck } from 'lucide-react';
import { myAppwrite } from '@/api/appwrite';

const VerifyEmail = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-black">
      <Card className="w-[350px] p-4 shadow-md bg-white dark:bg-gray-800">
        <CardHeader className="flex items-center text-center">
          <MailCheck className="w-12 h-12 text-blue-500 dark:text-blue-400" />
          <CardTitle className="text-xl mt-2 text-gray-900 dark:text-gray-100">
            Verify Your Email
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
            A verification email has been sent to your inbox. Please check your email and click the
            verification link.
          </p>
          <Button
            variant="default"
            className="w-full"
            onClick={async () => {
              await myAppwrite.sendUserVerificationEmail();
            }}
          >
            Resend Email
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;
