import React from 'react';
import { MapLocationPickerView } from "@/features/location/MapLocationPickerView";
import { SavedAddress } from '@/types';
import { Home, Briefcase, Navigation } from 'lucide-react';

interface EditAddressViewProps {
  address: SavedAddress;
  setAddresses: React.Dispatch<React.SetStateAction<SavedAddress[]>>;
  onClose: () => void;
}

export const EditAddressView: React.FC<EditAddressViewProps> = ({ address, setAddresses, onClose }) => {
  const coords: [number, number] = address.coordinates
    ? [address.coordinates.lat, address.coordinates.lng]
    : [28.6139, 77.2090]; // Default Delhi NCR / current coordinates

  return (
    <MapLocationPickerView
      initialLocation={{
        title: address.type,
        subtitle: address.address,
        coords
      }}
      initialBuilding={address.building || ''}
      initialStreet={address.street || ''}
      initialAddressType={address.type || 'Home'}
      isEditing={true}
      onClose={onClose}
      onConfirm={(updatedAddress) => {
        const icon = updatedAddress.type === 'Home' ? Home : updatedAddress.type === 'Work' ? Briefcase : Navigation;
        setAddresses((prev) =>
          prev.map((addr) =>
            addr.id === address.id
              ? {
                  ...addr,
                  type: updatedAddress.type,
                  address: updatedAddress.address,
                  building: updatedAddress.building,
                  street: updatedAddress.street,
                  coordinates: updatedAddress.coordinates,
                  icon,
                }
              : addr
          )
        );
        onClose();
      }}
    />
  );
};
