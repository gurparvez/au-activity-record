import { useState } from 'react';
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
import { Trash2 } from 'lucide-react';
import { sanitizeKey } from '@/utils';

// TODO: add loading on save changes

// Define the type for an attribute
interface Attribute {
  id: number;
  attributeName: string;
  attributeType: string;
  isRequired: boolean;
}

const NewActivity = () => {
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [activityName, setActivityName] = useState<string>('');

  // Appwrite-compatible attribute types
  const attributeTypes: string[] = [
    'string',
    'integer',
    'float',
    'boolean',
    'email',
    'enum',
    'ip',
    'url',
    'datetime',
  ];

  // Function to add new attribute input pair
  const addAttribute = () => {
    setAttributes([
      ...attributes,
      { id: Date.now(), attributeName: '', attributeType: '', isRequired: false },
    ]);
  };

  // Function to update attribute name
  const updateAttributeName = (id: number, value: string) => {
    setAttributes(
      attributes.map((attr) => (attr.id === id ? { ...attr, attributeName: value } : attr)),
    );
  };

  // Function to update attribute type
  const updateAttributeType = (id: number, value: string) => {
    setAttributes(
      attributes.map((attr) => (attr.id === id ? { ...attr, attributeType: value } : attr)),
    );
  };

  // Function to update required status
  const updateRequiredStatus = (id: number, checked: boolean) => {
    setAttributes(
      attributes.map((attr) => (attr.id === id ? { ...attr, isRequired: checked } : attr)),
    );
  };

  // Function to delete an attribute
  const deleteAttribute = (id: number) => {
    setAttributes(attributes.filter((attr) => attr.id !== id));
  };

  // Function to clear all fields
  const clearAll = () => {
    setAttributes([]);
    setActivityName('');
  };

  const onSubmit = async () => {
    const formattedAttributes = attributes.map(attr => ({
      key: sanitizeKey(attr.attributeName),
      type: attr.attributeType,
      required: attr.isRequired
    }));

    console.log({
      activityName,
      attributes: formattedAttributes
    });

    try {
      await myAppwrite.createNewActivityCollection(activityName, formattedAttributes);
    } catch (e) {
      console.error('Error:', e);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>New</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>New Activity</DialogTitle>
          <DialogDescription>
            Create a new activity form with attributes for Appwrite. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="activity-name">Activity Name</Label>
            <Input
              id="activity-name"
              value={activityName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setActivityName(e.target.value)}
              placeholder="Enter activity name"
            />
          </div>
          {attributes.map((attribute) => (
            <div key={attribute.id} className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-4 space-y-2">
                <Label htmlFor={`name-${attribute.id}`} className="sr-only">
                  Attribute Name
                </Label>
                <Input
                  id={`name-${attribute.id}`}
                  value={attribute.attributeName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateAttributeName(attribute.id, e.target.value)
                  }
                  placeholder="Attribute name"
                />
              </div>
              <div className="col-span-4 space-y-2">
                <Label htmlFor={`type-${attribute.id}`} className="sr-only">
                  Attribute Type
                </Label>
                <Select
                  onValueChange={(value: string) => updateAttributeType(attribute.id, value)}
                  value={attribute.attributeType}
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
                />
                <Label htmlFor={`required-${attribute.id}`}>Required</Label>
              </div>
              <div className="col-span-2">
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => deleteAttribute(attribute.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          <Button variant="outline" onClick={addAttribute}>
            Add Attribute
          </Button>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={clearAll}>
            Clear All
          </Button>
          <Button onClick={onSubmit}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewActivity;
