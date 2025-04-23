import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router';
import { RootState } from '@/store';
import { myAppwrite } from '@/api/appwrite';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface Attribute {
  key: string;
  type: string;
  required: boolean;
  array: boolean;
  elements?: string[];
}

interface FormData {
  [key: string]: any;
}

// Helper function to format attribute keys (e.g., link_to_website -> Link to website)
const formatAttributeKey = (key: string): string => {
  return key
    .split('_')
    .map((word, index) => {
      if (index === 0) {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      }
      return word.toLowerCase();
    })
    .join(' ');
};

const NewRecord = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Get activity from Redux
  const activity = useSelector((state: RootState) =>
    state.activities.activities.find((act) => act.collectionId === id)
  );

  // Initialize form data
  const initialFormData: FormData = activity?.attributes.reduce((acc, attr) => ({
    ...acc,
    [attr.key]: attr.array ? [''] : ''
  }), {}) || {};

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loading, setLoading] = useState(false);

  if (!activity || !id) {
    return <div>Activity not found</div>;
  }

  const handleInputChange = (key: string, value: string, index?: number) => {
    setFormData((prev) => {
      if (index !== undefined) {
        const newArray = [...(prev[key] || [])];
        newArray[index] = value;
        return { ...prev, [key]: newArray };
      }
      return { ...prev, [key]: value };
    });
  };

  const handleAddArrayItem = (key: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: [...(prev[key] || []), '']
    }));
  };

  const handleRemoveArrayItem = (key: string, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [key]: prev[key].filter((_: any, i: number) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare data for submission
      const data: Record<string, any> = Object.keys(formData).reduce((acc, key) => {
        const attr = activity.attributes.find(a => a.key === key);
        if (!attr) return acc;

        let value = formData[key];
        if (attr.array) {
          value = value.filter((v: string) => v !== '');
          if (value.length === 0 && !attr.required) return acc;
        } else if (value === '' && !attr.required) {
          return acc;
        }

        // Convert to appropriate type
        if (attr.type === 'integer') {
          value = attr.array ? value.map((v: string) => parseInt(v)) : parseInt(value);
        } else if (attr.type === 'double') {
          value = attr.array ? value.map((v: string) => parseFloat(v)) : parseFloat(value);
        } else if (attr.type === 'boolean') {
          value = attr.array ? value.map((v: string) => v === 'true') : value === 'true';
        }

        return { ...acc, [key]: value };
      }, {});

      // Submit to Appwrite
      await myAppwrite.createDocument(id, data);
      toast.success('Record created successfully');
      navigate(`/team/hod/activity/${id}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>New Record for {activity.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {activity.attributes.map((attr) => (
              <div key={attr.key} className="space-y-2">
                <Label htmlFor={attr.key}>
                  {formatAttributeKey(attr.key)} {attr.required && <span className="text-red-500">*</span>}
                </Label>
                {attr.array ? (
                  <div className="space-y-2">
                    {(formData[attr.key] || []).map((value: string, index: number) => (
                      <div key={`${attr.key}-${index}`} className="flex items-center space-x-2">
                        <Input
                          id={`${attr.key}-${index}`}
                          type={attr.type === 'integer' || attr.type === 'double' ? 'number' : 'text'}
                          value={value}
                          onChange={(e) => handleInputChange(attr.key, e.target.value, index)}
                          placeholder={`Enter ${formatAttributeKey(attr.key)}`}
                          required={attr.required && index === 0}
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveArrayItem(attr.key, index)}
                          disabled={formData[attr.key].length === 1}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddArrayItem(attr.key)}
                    >
                      Add {formatAttributeKey(attr.key)}
                    </Button>
                  </div>
                ) : (
                  <Input
                    id={attr.key}
                    type={attr.type === 'integer' || attr.type === 'double' ? 'number' : 'text'}
                    value={formData[attr.key] || ''}
                    onChange={(e) => handleInputChange(attr.key, e.target.value)}
                    placeholder={`Enter ${formatAttributeKey(attr.key)}`}
                    required={attr.required}
                  />
                )}
              </div>
            ))}
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/team/hod/activity/${id}`)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Record'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewRecord;