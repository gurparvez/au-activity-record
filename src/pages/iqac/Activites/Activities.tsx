import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import NewActivity from './NewActivity';

const Activities = () => {
  // Sample data for 20 forms (replace with your actual data)
  const forms = Array.from({ length: 20 }, (_, index) => ({
    title: `Form ${index + 1}`,
    count: Math.floor(Math.random() * 100),
    lastFilled: '2025-04-14',
  }));

  return (
    <>
      <div className="flex justify-between">
        <h1>Activities</h1>
        <div className="flex items-center *:mx-2">
          <Button variant="outline">Select</Button>
          {/* TODO: Add sidebar for adding new activity */}
          <NewActivity />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {forms.map((form, index) => (
          <Card key={index} className="m-2 hover:cursor-pointer hover:scale-105 transition-all">
            <CardContent className="p-6">
              <h6 className="text-lg font-semibold">{form.title}</h6>
              <span className="block text-sm text-gray-600">Forms filled: {form.count}</span>
              <span className="block text-sm text-gray-600">Last filled: {form.lastFilled}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};

export default Activities;
