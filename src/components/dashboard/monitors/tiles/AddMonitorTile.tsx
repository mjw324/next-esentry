// components/dashboard/monitors/AddMonitorTile.tsx
import { Card, CardBody } from "@nextui-org/react";
import { Plus } from "lucide-react";

interface AddMonitorTileProps {
  onClick: () => void;
}

export default function AddMonitorTile({ onClick }: AddMonitorTileProps) {
  return (
    <Card
      isPressable
      onPress={onClick}
      className="w-full mx-auto h-full border-2 border-solid bg-transparent hover:bg-default-100"
    >
      <CardBody className="flex items-center justify-center min-h-[140px]">
        <Plus size={24} className="text-default-500" />
        <p className="text-default-500 mt-2">Add New Monitor</p>
      </CardBody>
    </Card>
  );
}
