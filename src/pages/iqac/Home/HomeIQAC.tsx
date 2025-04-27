import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { myAppwrite } from '@/api/appwrite';
import { Models } from 'appwrite';

const HomeIQAC = () => {
  const [confirmationData, setConfirmationData] = useState<Models.Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConfirmationData = async () => {
    try {
      setLoading(true);
      const data = await myAppwrite.getConfirmationData();
      setConfirmationData(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching confirmation data:', err);
      setError('Failed to fetch confirmation data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfirmationData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="max-w-md mx-auto mt-10">
        <CardHeader>
          <CardTitle className="text-red-600">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <Card className="w-full max-w-5xl">
        <CardHeader>
          <CardTitle className="text-center text-xl">Confirmation Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="">
                  <th className="border border-gray-300 p-2">Department</th>
                  <th className="border border-gray-300 p-2">
                    20.03.{confirmationData[0].year} to 25.04.{confirmationData[0].year}
                  </th>
                  <th className="border border-gray-300 p-2">
                    01.08.{confirmationData[0].year} to 22.10.{confirmationData[0].year}
                  </th>
                  <th className="border border-gray-300 p-2">
                    22.10.{confirmationData[0].year} to 24.01.{confirmationData[0].year + 1}
                  </th>
                </tr>
              </thead>
              <tbody>
                {confirmationData.map((doc) => {
                  return (
                    <tr key={doc.$id} className="text-center">
                      <td className="border border-gray-300 p-2">
                        {doc.department?.name || 'Unknown'}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {doc['from_20.03_to_25.04'] === '1' ? '✅' : '❌'}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {doc['from_01.08_to_22.10'] === '1' ? '✅' : '❌'}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {doc['from_22.10_to_24.01'] === '1' ? '✅' : '❌'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HomeIQAC;
