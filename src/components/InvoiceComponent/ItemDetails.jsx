
import React from 'react';
import FloatingLabelInput from './FloatingLabelInput';
import { Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";

const ItemDetails = ({ items, handleItemChange, addItem, removeItem }) => {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-semibold mb-4">Item Details</h2>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="relative border border-gray-200 p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
              <FloatingLabelInput
                id={`itemName${index}`}
                label="Item Name *"
                value={item.name}
                onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                className="bg-white"
              />
              <FloatingLabelInput
                id={`itemHsn${index}`}
                label="HSN Code"
                value={item.hsnCode || ''}
                onChange={(e) => {
                  e.target.value.length <= 8 &&
                    handleItemChange(index, 'hsnCode', e.target.value);
                }}
                className="bg-white"
              />
              <FloatingLabelInput
                id={`itemQuantity${index}`}
                label="Quantity *"
                type="number"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                className="bg-white"
              />
              <FloatingLabelInput
                id={`itemAmount${index}`}
                label="Rate *"
                type="number"
                value={item.amount}
                onChange={(e) => handleItemChange(index, 'amount', parseFloat(e.target.value) || 0)}
                className="bg-white"
              />
              <FloatingLabelInput
                id={`itemTotal${index}`}
                label="Total"
                type="number"
                value={(item.quantity * item.amount).toFixed(2)}
                disabled
                className="bg-gray-100"
              />
            </div>
            <FloatingLabelInput
              id={`itemDescription${index}`}
              label="Description"
              value={item.description}
              onChange={(e) => handleItemChange(index, 'description', e.target.value)}
              className="bg-white"
            />
            {index > 0 && (
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-1 right-2"

                onClick={() => removeItem(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
      <div className="mt-6">
        <Button
          type="button"
          onClick={addItem}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
        >
          + Add Item
        </Button>
      </div>
    </div>
  );
};

export default ItemDetails;
