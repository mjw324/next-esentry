// components/dashboard/monitors/MonitorTile.tsx
import { Button, Card, CardBody, CardHeader } from "@nextui-org/react";
import { Play, Pause, Edit, Trash2 } from "lucide-react";

interface MonitorTileProps {
  keywords: string[];
  excludedKeywords?: string[];
  seller?: string;
  isActive: boolean;
  minPrice?: number;
  maxPrice?: number;
  condition?: string[];
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function MonitorTile({
  keywords,
  excludedKeywords,
  seller,
  isActive,
  minPrice,
  maxPrice,
  condition,
  onToggle,
  onEdit,
  onDelete,
}: MonitorTileProps) {
  return (
    <Card className="w-full">
      <CardHeader className="flex justify-between gap-3">
        <div className="flex flex-col">
          <p className="text-md font-bold">{keywords.join(", ")}</p>
        </div>
        <div className="flex gap-1">
          <Button
            isIconOnly
            size="sm"
            variant="light"
            color={isActive ? "secondary" : "success"}
            onPress={onToggle}
            aria-label={isActive ? "Pause monitor" : "Start monitor"}
          >
            {isActive ? <Pause size={18} /> : <Play size={18} />}
          </Button>
          <Button
            isIconOnly
            size="sm"
            variant="light"
            onPress={onEdit}
            aria-label="Edit monitor"
          >
            <Edit size={18} />
          </Button>
          <Button
            isIconOnly
            size="sm"
            variant="light"
            color="danger"
            onPress={onDelete}
            aria-label="Delete monitor"
          >
            <Trash2 size={18} />
          </Button>
        </div>
      </CardHeader>
      <CardBody>
        {excludedKeywords && excludedKeywords.length > 0 && (
          <p className="text-small text-default-500">
            <span className="font-semibold">Excluded:</span>{" "}
            {excludedKeywords.join(", ")}
          </p>
        )}
        {seller && (
          <p className="text-small text-default-500">
            <span className="font-semibold">Seller:</span> {seller}
          </p>
        )}
        {(minPrice !== undefined || maxPrice !== undefined) && (
          <p className="text-small text-default-500">
            <span className="font-semibold">Price:</span>{" "}
            {minPrice !== undefined && maxPrice === undefined
              ? `$${minPrice}+`
              : `${minPrice !== undefined ? `$${minPrice}` : "$0"} - ${
                  maxPrice !== undefined ? `$${maxPrice}` : "+"
                }`}
          </p>
        )}
        {condition && condition.length > 0 && (
          <p className="text-small text-default-500">
            <span className="font-semibold">Condition:</span>{" "}
            {condition.join(", ")}
          </p>
        )}
      </CardBody>
    </Card>
  );
}
