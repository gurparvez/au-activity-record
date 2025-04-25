import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router';
import { RootState } from '@/store';
import { account, myAppwrite } from '@/api/appwrite';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

  // State for current user ID
  const [currentUserName, setCurrentUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Initialize form data, excluding user attribute
  const initialFormData: FormData = activity?.attributes
    .filter(attr => attr.key !== 'user')
    .reduce((acc, attr) => ({
      ...acc,
      [attr.key]: attr.array ? [''] : ''
    }), {}) || {};

  const [formData, setFormData] = useState<FormData>(initialFormData);

  // Fetch current user ID on component mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await account.get();
        setCurrentUserName(user.name);
      } catch (error) {
        console.error('Failed to fetch current user:', error);
        toast.error('Failed to fetch user information');
      }
    };
    fetchUser();
  }, []);

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

  const getInputComponent = (attr: Attribute, value: string, index?: number) => {
    const inputId = index !== undefined ? `${attr.key}-${index}` : attr.key;
    const onChange = (e: string | React.ChangeEvent<HTMLInputElement>) => {
      const newValue = typeof e === 'string' ? e : e.target.value;
      handleInputChange(attr.key, newValue, index);
    };

    switch (attr.type) {
      case 'integer':
      case 'float':
      case 'double':
        return (
          <Input
            id={inputId}
            type="number"
            value={value}
            onChange={onChange}
            placeholder={`Enter ${formatAttributeKey(attr.key)}`}
            required={attr.required && (index === undefined || index === 0)}
          />
        );
      case 'boolean':
        return (
          <Select onValueChange={onChange} value={value}>
            <SelectTrigger id={inputId}>
              <SelectValue placeholder={`Select ${formatAttributeKey(attr.key)}`} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">True</SelectItem>
              <SelectItem value="false">False</SelectItem>
            </SelectContent>
          </Select>
        );
      case 'email':
        return (
          <Input
            id={inputId}
            type="email"
            value={value}
            onChange={onChange}
            placeholder={`Enter ${formatAttributeKey(attr.key)}`}
            required={attr.required && (index === undefined || index === 0)}
          />
        );
      case 'url':
        return (
          <Input
            id={inputId}
            type="url"
            value={value}
            onChange={onChange}
            placeholder={`Enter ${formatAttributeKey(attr.key)}`}
            required={attr.required && (index === undefined || index === 0)}
          />
        );
      case 'datetime':
        return (
          <Input
            id={inputId}
            type="datetime-local"
            value={value}
            onChange={onChange}
            placeholder={`Enter ${formatAttributeKey(attr.key)}`}
            required={attr.required && (index === undefined || index === 0)}
          />
        );
      case 'ip':
      case 'string':
      default:
        if (attr.elements && attr.elements.length > 0) {
          return (
            <Select onValueChange={onChange} value={value}>
              <SelectTrigger id={inputId}>
                <SelectValue placeholder={`Select ${formatAttributeKey(attr.key)}`} />
              </SelectTrigger>
              <SelectContent>
                {attr.elements.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        }
        return (
          <Input
            id={inputId}
            type="text"
            value={value}
            onChange={onChange}
            placeholder={`Enter ${formatAttributeKey(attr.key)}`}
            required={attr.required && (index === undefined || index === 0)}
          />
        );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare data for submission
      const data: { [key: string]: any } = Object.keys(formData).reduce((acc, key) => {
        const attr = activity.attributes.find((a) => a.key === key);
        if (!attr) return acc;

        let value = formData[key];
        if (attr.array) {
          value = value.filter((v: string) => v !== '');
          if (value.length === 0 && !attr.required) return acc;
        } else if (value === '' && !attr.required) {
          return acc;
        }

        // Convert to appropriate type
        switch (attr.type) {
          case 'integer':
            value = attr.array ? value.map((v: string) => parseInt(v, 10)) : parseInt(value, 10);
            break;
          case 'float':
          case 'double':
            value = attr.array ? value.map((v: string) => parseFloat(v)) : parseFloat(value);
            break;
          case 'boolean':
            value = attr.array ? value.map((v: string) => v === 'true') : value === 'true';
            break;
          case 'enum':
            if (attr.array) {
              value.forEach((v: string) => {
                if (!attr.elements?.includes(v)) {
                  throw new Error(`Invalid enum value "${v}" for ${formatAttributeKey(key)}`);
                }
              });
            } else if (!attr.elements?.includes(value)) {
              throw new Error(`Invalid enum value "${value}" for contempo ${formatAttributeKey(key)}`);
            }
            break;
          case 'datetime':
            if (value && !isNaN(new Date(value).getTime())) {
              value = new Date(value).toISOString();
            } else if (attr.required) {
              throw new Error(`Invalid datetime for ${formatAttributeKey(key)}`);
            }
            break;
          default:
            // string, email, url, ip: keep as string
            break;
        }

        return { ...acc, [key]: value };
      }, {});

      // Add user ID if user attribute exists
      const hasUserAttribute = activity.attributes.some(attr => attr.key === 'user');
      if (hasUserAttribute) {
        if (!currentUserName) {
          throw new Error('User ID not available');
        }
        data.user = currentUserName;
      }

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
            {activity.attributes
              .filter(attr => attr.key !== 'user') // Hide user attribute
              .map((attr) => (
                <div key={attr.key} className="space-y-2">
                  <Label htmlFor={attr.key}>
                    {formatAttributeKey(attr.key)} {attr.required && <span className="text-red-500">*</span>}
                  </Label>
                  {attr.array ? (
                    <div className="space-y-2">
                      {(formData[attr.key] || []).map((value: string, index: number) => (
                        <div key={`${attr.key}-${index}`} className="flex items-center space-x-2">
                          {getInputComponent(attr, value, index)}
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
                    getInputComponent(attr, formData[attr.key] || '')
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