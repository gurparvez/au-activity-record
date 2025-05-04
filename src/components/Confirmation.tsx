import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Toaster, toast } from 'sonner';
import { account, myAppwrite } from '@/api/appwrite';
import { Models } from 'appwrite';
import { Loader2 } from 'lucide-react';

interface FormData {
  'from_20.03_to_25.04': boolean;
  'from_01.08_to_22.10': boolean;
  'from_22.10_to_24.01': boolean;
}

interface ConfirmationProps {
  onSubmit: () => void; // Callback to trigger refetch in parent
}

const Confirmation = ({ onSubmit }: ConfirmationProps) => {
  const [formData, setFormData] = useState<FormData>({
    'from_20.03_to_25.04': false,
    'from_01.08_to_22.10': false,
    'from_22.10_to_24.01': false,
  });
  const [department, setDepartment] = useState<Models.Document | null>(null);
  const [confirmationData, setConfirmationData] = useState<Models.Document | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user department and confirmation data
  useEffect(() => {
    const fetchUserDepartment = async () => {
      try {
        setLoading(true);
        const user = await account.get();
        const userDepartment = await myAppwrite.getUserDepartment(user.$id);
        if (!userDepartment) {
          throw new Error("User Department should not be null!")
        }
        const confirmationData = await myAppwrite.getConfirmationDataOfDepartment(
          userDepartment.$id,
        );
        setDepartment(userDepartment);
        setConfirmationData(confirmationData);

        // Update formData with fetched confirmation data
        if (confirmationData) {
          setFormData({
            'from_20.03_to_25.04': confirmationData['from_20.03_to_25.04'] === '1',
            'from_01.08_to_22.10': confirmationData['from_01.08_to_22.10'] === '1',
            'from_22.10_to_24.01': confirmationData['from_22.10_to_24.01'] === '1',
          });
        }

        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data');
        console.error('Error fetching data:', err);
        setLoading(false);
      }
    };
    fetchUserDepartment();
  }, []);

  // Handle checkbox changes
  const handleCheckboxChange = (name: keyof FormData, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!department || !confirmationData) {
      setError('Department or confirmation data not identified');
      return;
    }
    try {
      setLoading(true);
      setError(null);

      // Update confirmation data in the database
      await myAppwrite.updateConfirmationDataOfDepartment(department.$id, formData);

      // Show toast notification
      toast.success(`Responses successfully updated for ${department.name || 'department'}!`, {
        duration: 3000, // Auto-dismiss after 3 seconds
      });

      // Trigger parent refetch
      onSubmit();

      setLoading(false);
    } catch (err) {
      setError('Failed to update responses');
      console.error('Error updating confirmation data:', err);
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-red-50 border border-red-200 rounded-lg">
        <h2 className="text-xl font-semibold text-red-600">Error</h2>
        <p className="text-red-600 mt-2">{error}</p>
      </div>
    );
  }

  // Main form
  return (
    <>
      <div className="mb-4">
        <h4>Confirmation</h4>
        <p className="mb-2">Department: {department?.name || 'Unknown'}</p>
        {confirmationData ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="from_20.03_to_25.04"
                checked={formData['from_20.03_to_25.04']}
                onCheckedChange={(checked) =>
                  handleCheckboxChange('from_20.03_to_25.04', checked as boolean)
                }
              />
              <Label htmlFor="from_20.03_to_25.04">
                I have uploaded the data for the period from 20.03.{confirmationData.year} to 25.04.
                {confirmationData.year}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="from_01.08_to_22.10"
                checked={formData['from_01.08_to_22.10']}
                onCheckedChange={(checked) =>
                  handleCheckboxChange('from_01.08_to_22.10', checked as boolean)
                }
              />
              <Label htmlFor="from_01.08_to_22.10">
                I have uploaded the data for the period from 01.08.{confirmationData.year} to 22.10.
                {confirmationData.year}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="from_22.10_to_24.01"
                checked={formData['from_22.10_to_24.01']}
                onCheckedChange={(checked) =>
                  handleCheckboxChange('from_22.10_to_24.01', checked as boolean)
                }
              />
              <Label htmlFor="from_22.10_to_24.01">
                I have uploaded the data for the period from 22.10.{confirmationData.year} to 24.01.
                {confirmationData.year + 1}
              </Label>
            </div>
            <Button onClick={handleSubmit} disabled={loading} className="mt-2">
              {loading ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        ) : (
          <p className="text-red-600">No confirmation data available for this department.</p>
        )}
      </div>
      <Toaster />
    </>
  );
};

export default Confirmation;