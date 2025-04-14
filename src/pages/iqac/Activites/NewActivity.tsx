import { useState } from 'react';
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
import {
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Sheet,
} from '@/components/ui/sheet';

// Define the type for an attribute
interface Attribute {
  id: number;
  attributeName: string;
  attributeType: string;
}

const NewActivity = () => {
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  console.log(attributes);

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
    setAttributes([...attributes, { id: Date.now(), attributeName: '', attributeType: '' }]);
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

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>New</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>New Activity</SheetTitle>
          <SheetDescription>
            Create a new activity form with attributes for Appwrite. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4 mx-4">
          {attributes.map((attribute) => (
            <div key={attribute.id} className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`name-${attribute.id}`}>Attribute Name</Label>
                <Input
                  id={`name-${attribute.id}`}
                  value={attribute.attributeName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateAttributeName(attribute.id, e.target.value)
                  }
                  placeholder="Enter attribute name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`type-${attribute.id}`}>Attribute Type</Label>
                <Select
                  onValueChange={(value: string) => updateAttributeType(attribute.id, value)}
                  value={attribute.attributeType}
                >
                  <SelectTrigger id={`type-${attribute.id}`}>
                    <SelectValue placeholder="Select attribute type" />
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
            </div>
          ))}
          <Button variant="outline" onClick={addAttribute}>
            Add Attribute
          </Button>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default NewActivity;
