import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { myAppwrite } from '@/api/appwrite';
import { Trash2, Plus, X } from 'lucide-react';
import { formatAttributeKey, sanitizeKey } from '@/utils';
import { ActivityDetail } from '@/types';

// Define the type for an attribute
interface Attribute {
  id: string;
  attributeName: string;
  attributeType: string;
  isRequired: boolean;
  isArray: boolean;
  elements?: string[];
}

// Define props interface
interface NewActivityProps {
  onActivityCreated?: () => void;
  activityToEdit?: ActivityDetail | null;
  isEditing?: boolean;
  onEditComplete?: () => void;
}

const NewActivity = ({
  onActivityCreated,
  activityToEdit,
  isEditing = false,
  onEditComplete,
}: NewActivityProps) => {
  const [attributes, setAttributes] = useState<Attribute[]>([
    {
      id: uuidv4(),
      attributeName: 'user',
      attributeType: 'string',
      isRequired: true,
      isArray: false,
    },
    {
      id: uuidv4(),
      attributeName: 'department',
      attributeType: 'enum',
      isRequired: true,
      isArray: false,
      elements: [],
    },
  ]);
  const [activityName, setActivityName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [whoFilled, setWhoFilled] = useState<boolean>(true);
  const [departmentFilled, setDepartmentFilled] = useState<boolean>(true);
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [forceUpdate, setForceUpdate] = useState<boolean>(false);
  const [departmentsLoading, setDepartmentsLoading] = useState<boolean>(true);
  const [departmentElements, setDepartmentElements] = useState<string[]>([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setDepartmentsLoading(true);
        const departments = await myAppwrite.getAllDepartments();
        const departmentNames = departments.map((dept: any) => dept.name);
        setDepartmentElements(departmentNames);
        // Update department attribute with fetched elements
        setAttributes((prev) =>
          prev.map((attr) =>
            attr.attributeName === 'department' ? { ...attr, elements: departmentNames } : attr,
          ),
        );
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Failed to load departments. Please try again.');
      } finally {
        setDepartmentsLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  // Appwrite-compatible attribute types
  const attributeTypes: string[] = [
    'string',
    'integer',
    'float',
    'boolean',
    'email',
    'enum',
    'datetime',
    'url',
    'ip',
  ];

  // Function to validate attribute name
  const isValidAttributeName = (name: string): boolean => {
    if (!name.trim()) return false;
    try {
      const sanitized = sanitizeKey(name);
      return sanitized.length > 0 && /^[a-z0-9_]+$/.test(sanitized);
    } catch {
      return false;
    }
  };

  // Normalize attribute type (convert double to float)
  const normalizeAttributeType = (type: string): string => {
    if (type === 'double') return 'float';
    return type;
  };

  // Pre-fill form when editing
  useEffect(() => {
    if (isEditing && activityToEdit) {
      setActivityName(activityToEdit.title);
      setWhoFilled(activityToEdit.attributes.some((attr) => attr.key === 'user'));
      setDepartmentFilled(activityToEdit.attributes.some((attr) => attr.key === 'department'));
      setAttributes(
        activityToEdit.attributes.map((attr) => ({
          id: uuidv4(),
          attributeName: attr.key,
          attributeType: normalizeAttributeType(attr.type),
          isRequired: attr.required,
          isArray: attr.array || false,
          elements: attr.elements || [],
        })),
      );
      setOpen(true);
    }
  }, [activityToEdit, isEditing]);

  // Effect to handle user attribute based on whoFilled checkbox
  useEffect(() => {
    if (whoFilled && !attributes.some((attr) => attr.attributeName === 'user')) {
      setAttributes((prev) => [
        ...prev,
        {
          id: uuidv4(),
          attributeName: 'user',
          attributeType: 'string',
          isRequired: true,
          isArray: false,
        },
      ]);
    } else if (!whoFilled && attributes.some((attr) => attr.attributeName === 'user')) {
      setAttributes((prev) => prev.filter((attr) => attr.attributeName !== 'user'));
    }
  }, [whoFilled, attributes]);

  useEffect(() => {
    if (departmentFilled && !attributes.some((attr) => attr.attributeName === 'department')) {
      setAttributes((prev) => [
        ...prev,
        {
          id: uuidv4(),
          attributeName: 'department',
          attributeType: 'enum',
          isRequired: true,
          isArray: false,
          elements: departmentElements,
        },
      ]);
    } else if (
      !departmentFilled &&
      attributes.some((attr) => attr.attributeName === 'department')
    ) {
      setAttributes((prev) => prev.filter((attr) => attr.attributeName !== 'department'));
    }
  }, [departmentFilled, attributes, departmentElements]);

  // Function to add new attribute
  const addAttribute = () => {
    setAttributes([
      ...attributes,
      {
        id: uuidv4(),
        attributeName: '',
        attributeType: '',
        isRequired: false,
        isArray: false,
        elements: [],
      },
    ]);
  };

  // Function to update attribute name
  const updateAttributeName = (id: string, value: string) => {
    setAttributes(
      attributes.map((attr) => (attr.id === id ? { ...attr, attributeName: value } : attr)),
    );
  };

  // Function to update attribute type
  const updateAttributeType = (id: string, value: string) => {
    setAttributes(
      attributes.map((attr) =>
        attr.id === id
          ? { ...attr, attributeType: value, elements: value === 'enum' ? attr.elements || [] : [] }
          : attr,
      ),
    );
  };

  // Function to update required status
  const updateRequiredStatus = (id: string, checked: boolean) => {
    setAttributes(
      attributes.map((attr) => (attr.id === id ? { ...attr, isRequired: checked } : attr)),
    );
  };

  // Function to update enum elements
  const updateEnumElement = (id: string, index: number, value: string) => {
    setAttributes(
      attributes.map((attr) =>
        attr.id === id
          ? {
              ...attr,
              elements: attr.elements?.map((el, i) => (i === index ? value : el)),
            }
          : attr,
      ),
    );
  };

  // Function to add a new enum element
  const addEnumElement = (id: string) => {
    setAttributes(
      attributes.map((attr) =>
        attr.id === id ? { ...attr, elements: [...(attr.elements || []), ''] } : attr,
      ),
    );
  };

  // Function to remove an enum element
  const removeEnumElement = (id: string, index: number) => {
    setAttributes(
      attributes.map((attr) =>
        attr.id === id
          ? {
              ...attr,
              elements: attr.elements?.filter((_, i) => i !== index),
            }
          : attr,
      ),
    );
  };

  // Function to delete an attribute
  const deleteAttribute = (id: string) => {
    setAttributes(attributes.filter((attr) => attr.id !== id));
  };

  // Function to clear all fields
  const clearAll = () => {
    setAttributes([]);
    setActivityName('');
    setError(null);
    setWhoFilled(true);
    setOpen(false);
    setForceUpdate(false);
    if (isEditing && onEditComplete) {
      onEditComplete();
    }
  };

  // Check if attributes have changed (for edit mode)
  const haveAttributesChanged = () => {
    if (!isEditing || !activityToEdit) return false;
    const originalAttributes = activityToEdit.attributes;
    const currentAttributes = attributes;

    if (activityToEdit.title !== activityName.trim()) return true;
    if (originalAttributes.length !== currentAttributes.length) return true;

    return originalAttributes.some((origAttr, index) => {
      const currAttr = currentAttributes[index];
      return (
        origAttr.key !== sanitizeKey(currAttr.attributeName) ||
        normalizeAttributeType(origAttr.type) !== currAttr.attributeType ||
        origAttr.required !== currAttr.isRequired ||
        origAttr.array !== currAttr.isArray ||
        JSON.stringify(origAttr.elements || []) !== JSON.stringify(currAttr.elements || [])
      );
    });
  };

  // Validate and submit the form
  const onSubmit = async () => {
    setLoading(true);
    setError(null);

    // Validation
    if (!activityName.trim()) {
      setError('Activity name is required.');
      setLoading(false);
      return;
    }

    if (attributes.length === 0) {
      setError('At least one attribute is required.');
      setLoading(false);
      return;
    }

    for (const attr of attributes) {
      if (!attr.attributeName.trim()) {
        setError(`Attribute name cannot be empty.`);
        setLoading(false);
        return;
      }
      if (!isValidAttributeName(attr.attributeName)) {
        setError(
          `Attribute name "${attr.attributeName}" is invalid. Use letters, numbers, spaces, or underscores.`,
        );
        setLoading(false);
        return;
      }
      if (!attr.attributeType) {
        setError(`Attribute "${attr.attributeName}" must have a type.`);
        setLoading(false);
        return;
      }
      if (attr.attributeType === 'enum' && (!attr.elements || attr.elements.length === 0)) {
        setError(`Enum attribute "${attr.attributeName}" must have at least one element.`);
        setLoading(false);
        return;
      }
      if (attr.attributeType === 'enum' && attr.elements?.some((el) => !el.trim())) {
        setError(`Enum attribute "${attr.attributeName}" cannot have empty elements.`);
        setLoading(false);
        return;
      }
    }

    // Format attributes for Appwrite
    const formattedAttributes = attributes.map((attr) => ({
      key: sanitizeKey(attr.attributeName),
      type: attr.attributeType,
      required: attr.isRequired,
      array: attr.isArray,
      ...(attr.attributeType === 'enum' && attr.elements ? { elements: attr.elements } : {}),
    }));

    // Check if attributes have changed and require confirmation
    if (isEditing && haveAttributesChanged() && !forceUpdate) {
      setShowConfirmDialog(true);
      setLoading(false);
      return;
    }

    try {
      if (isEditing && activityToEdit) {
        await myAppwrite.updateActivityCollection(
          activityToEdit.collectionId,
          activityName,
          formattedAttributes,
          forceUpdate,
        );
      } else {
        await myAppwrite.createNewActivityCollection(activityName, formattedAttributes);
      }
      setLoading(false);
      setOpen(false);
      clearAll();
      if (onActivityCreated) {
        onActivityCreated();
      }
    } catch (e: unknown) {
      const errorMessage =
        e instanceof Error ? e.message : 'An error occurred while saving the activity.';
      setError(errorMessage);
      setLoading(false);
    }
  };

  // Handle confirmation for attribute changes
  const handleConfirmUpdate = () => {
    setForceUpdate(true);
    setShowConfirmDialog(false);
    onSubmit();
  };

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(open) => {
          setOpen(open);
          if (!open && isEditing) clearAll();
        }}
      >
        <DialogTrigger asChild>
          <Button>{isEditing ? '' : 'New'}</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Activity' : 'New Activity'}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Update the activity form with attributes for Appwrite. Click save when you're done."
                : "Create a new activity form with attributes for Appwrite. Click save when you're done."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="activity-name">Activity Name</Label>
              <Input
                id="activity-name"
                value={activityName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setActivityName(e.target.value)
                }
                placeholder="Enter activity name"
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Checkbox
                  id="who-filled"
                  checked={whoFilled}
                  onCheckedChange={(checked: boolean) => setWhoFilled(checked)}
                />
                <Label htmlFor="who-filled">Who filled (adds user attribute)</Label>
              </div>
              <div className="flex items-center space-x-1">
                <Checkbox
                  id="department-filled"
                  checked={departmentFilled}
                  onCheckedChange={(checked: boolean) => setDepartmentFilled(checked)}
                />
                <Label htmlFor="department-filled">Department</Label>
              </div>
            </div>
            {attributes.map((attribute) => (
              <div className="space-y-4 border p-4 rounded-md" key={attribute.id}>
                <div className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-4 space-y-2">
                    <Label htmlFor={`name-${attribute.id}`}>
                      {attribute.attributeName.trim()
                        ? formatAttributeKey(sanitizeKey(attribute.attributeName))
                        : 'Attribute Name'}
                    </Label>
                    <Input
                      id={`name-${attribute.id}`}
                      value={attribute.attributeName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        updateAttributeName(attribute.id, e.target.value)
                      }
                      placeholder="Enter attribute name"
                      aria-invalid={
                        !isValidAttributeName(attribute.attributeName) &&
                        attribute.attributeName !== ''
                      }
                      aria-describedby={`name-error-${attribute.id}`}
                      disabled={attribute.attributeName === 'user'}
                    />
                    {!isValidAttributeName(attribute.attributeName) &&
                      attribute.attributeName !== '' && (
                        <p id={`name-error-${attribute.id}`} className="text-red-500 text-sm">
                          Invalid name. Use letters, numbers, spaces, or underscores.
                        </p>
                      )}
                  </div>
                  <div className="col-span-4 space-y-2">
                    <Label htmlFor={`type-${attribute.id}`}>Attribute Type</Label>
                    <Select
                      onValueChange={(value: string) => updateAttributeType(attribute.id, value)}
                      value={attribute.attributeType}
                      disabled={attribute.attributeName === 'user'}
                    >
                      <SelectTrigger id={`type-${attribute.id}`}>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {attributeTypes.map((type) => (
                          <SelectItem key={type} value={type} className="hover:cursor-pointer">
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2 flex items-center space-x-2">
                    <Checkbox
                      id={`required-${attribute.id}`}
                      checked={attribute.isRequired}
                      onCheckedChange={(checked: boolean) =>
                        updateRequiredStatus(attribute.id, checked)
                      }
                      disabled={attribute.attributeName === 'user'}
                    />
                    <Label htmlFor={`required-${attribute.id}`}>Required</Label>
                  </div>
                  <div className="col-span-2">
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => deleteAttribute(attribute.id)}
                      disabled={attribute.attributeName === 'user'}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {attribute.attributeType === 'enum' && (
                  <div className="space-y-2">
                    <Label>Enum Elements</Label>
                    {attribute.attributeName === 'department' && departmentsLoading ? (
                      <div className="space-y-2">
                        <div className="h-10 bg-gray-200 animate-pulse rounded" />
                        <div className="h-10 bg-gray-200 animate-pulse rounded" />
                      </div>
                    ) : (
                      attribute.elements?.map((element, index) => (
                        <div
                          key={`element-${attribute.id}-${index}`}
                          className="flex items-center space-x-2"
                        >
                          <Input
                            id={`element-${attribute.id}-${index}`}
                            value={element}
                            onChange={(e) => updateEnumElement(attribute.id, index, e.target.value)}
                            placeholder={`Enter enum element ${index + 1}`}
                            aria-invalid={!element.trim()}
                            aria-describedby={`element-error-${attribute.id}-${index}`}
                            disabled={attribute.attributeName === 'department'}
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => removeEnumElement(attribute.id, index)}
                            disabled={
                              attribute.elements?.length === 1 ||
                              attribute.attributeName === 'department'
                            }
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          {!element.trim() && (
                            <p
                              id={`element-error-${attribute.id}-${index}`}
                              className="text-red-500 text-sm"
                            >
                              Element cannot be empty.
                            </p>
                          )}
                        </div>
                      ))
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addEnumElement(attribute.id)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Enum Element
                    </Button>
                  </div>
                )}
              </div>
            ))}
            <Button variant="outline" onClick={addAttribute}>
              Add Attribute
            </Button>
          </div>
          {error && (
            <div className="text-red-500 text-sm" role="alert">
              {error}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={clearAll} disabled={loading}>
              Clear All
            </Button>
            <Button onClick={onSubmit} disabled={loading}>
              Save changes
              {loading && (
                <svg
                  className="animate-spin ml-2 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog for Attribute Changes */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-400">Confirm Attribute Changes</DialogTitle>
            <DialogDescription>
              The changes to the activity’s attributes may result in data loss for existing records.
              Are you sure you want to proceed? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmUpdate}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewActivity;
