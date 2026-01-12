// EditRecord.tsx
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router';
import { RootState } from '@/store';
import { account, myAppwrite } from '@/api/appwrite';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { formatAttributeKey } from '@/utils/formatAttributeKey';

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

const EditRecord = () => {
  const { id, docId } = useParams<{ id: string; docId: string }>();
  const navigate = useNavigate();

  // Get activity from Redux
  const activity = useSelector((state: RootState) =>
    state.activities.activities.find((act) => act.collectionId === id),
  );

  // State for current user name
  const [currentUserName, setCurrentUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize form data
  const [formData, setFormData] = useState<FormData>({});

  // Fetch current user name and document data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch current user
        const user = await account.get();
        setCurrentUserName(user.name);

        // Fetch document
        if (id && docId) {
          const document = await myAppwrite.getDocument(id, docId);
          const initialFormData = activity?.attributes
            .filter((attr) => attr.key !== 'user')
            .reduce(
              (acc, attr) => ({
                ...acc,
                [attr.key]: document[attr.key] ?? (attr.array ? [''] : ''),
              }),
              {},
            );
          setFormData(initialFormData || {});
        }
      } catch (err: any) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setFetching(false);
      }
    };
    fetchData();
  }, [id, docId, activity]);

  if (!activity || !id || !docId) {
    return <div>Activity or document not found</div>;
  }

  if (fetching) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 text-lg">{error}</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => navigate(`/team/hod/activity/${id}`)}
        >
          Back
        </Button>
      </div>
    );
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
      [key]: [...(prev[key] || []), ''],
    }));
  };

  const handleRemoveArrayItem = (key: string, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [key]: prev[key].filter((_: any, i: number) => i !== index),
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
      case 'float':
      case 'double':
        return (
          <Input
            id={inputId}
            type="number"
            step="any"
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
            value={value ? new Date(value).toISOString().slice(0, 16) : ''}
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
      const data: { [key: string]: any } = Object.keys(formData).reduce((acc, key) => {
        const attr = activity.attributes.find((a) => a.key === key);
        if (!attr) return acc;

        let value = formData[key];
        if (attr.array) {
          // Filter out empty values in arrays
          value = value.filter((v: string) => v !== '');
          if (value.length === 0 && !attr.required) {
            return acc; // Skip empty non-required arrays
          }
        } else if (value === '' && !attr.required) {
          // Set empty non-required fields to null or skip them
          return { ...acc, [key]: null }; // Or simply `return acc;` to exclude
        }

        // Process non-empty values
        if (attr.array && value.length > 0) {
          switch (attr.type) {
            case 'integer':
              value = value.map((v: string) => parseInt(v, 10));
              break;
            case 'float':
            case 'double':
              value = value.map((v: string) => parseFloat(v));
              break;
            case 'boolean':
              value = value.map((v: string) => v === 'true');
              break;
            case 'enum':
              value.forEach((v: string) => {
                if (!attr.elements?.includes(v)) {
                  throw new Error(`Invalid enum value "${v}" for ${formatAttributeKey(key)}`);
                }
              });
              break;
            case 'datetime':
              value = value.map((v: string) => {
                if (!isNaN(new Date(v).getTime())) {
                  return new Date(v).toISOString();
                }
                throw new Error(`Invalid datetime for ${formatAttributeKey(key)}`);
              });
              break;
            default:
              break;
          }
        } else if (!attr.array && value !== '') {
          switch (attr.type) {
            case 'integer':
              value = parseInt(value, 10);
              break;
            case 'float':
            case 'double':
              value = parseFloat(value);
              break;
            case 'boolean':
              value = value === 'true';
              break;
            case 'enum':
              if (!attr.elements?.includes(value)) {
                throw new Error(`Invalid enum value "${value}" for ${formatAttributeKey(key)}`);
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
              break;
          }
        }

        return { ...acc, [key]: value };
      }, {});

      const hasUserAttribute = activity.attributes.some((attr) => attr.key === 'user');
      if (hasUserAttribute) {
        if (!currentUserName) {
          throw new Error('User name not available');
        }
        data.user = currentUserName;
      }

      await myAppwrite.updateDocument(id, docId, data);
      toast.success('Record updated successfully');
      navigate(`/team/hod/activity/${id}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-2">
      <div className="-mx-4">
        <div className="px-4">
          <h1 className="text-2xl font-bold mb-4">Edit Record for {activity.name}</h1>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
            {activity.attributes
              .filter((attr) => attr.key !== 'user')
              .map((attr) => (
                <div key={attr.key} className="space-y-2">
                  <Label htmlFor={attr.key}>
                    {formatAttributeKey(attr.key)}{' '}
                    {attr.required && <span className="text-red-500">*</span>}
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
            <div className="md:col-span-2 flex justify-end space-x-2 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/team/hod/activity/${id}`)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Updating...' : 'Update Record'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditRecord;