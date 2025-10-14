import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Tooltip,
} from "@heroui/react";
import {
  Play,
  Pause,
  Edit,
  Trash2,
  OctagonMinus,
  HandCoins,
  Store,
  Clock,
} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEbay } from "@fortawesome/free-brands-svg-icons";

interface MonitorTileProps {
  keywords: string[];
  isActive: boolean;
  excludedKeywords?: string[];
  sellers?: string[];
  minPrice?: number;
  maxPrice?: number;
  condition?: string[];
  monitorInterval?: number;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onView?: () => void;
}

type ConditionType = "new" | "used";
type ConditionColorType = "success" | "warning" | "secondary";

const formatCondition = (condition: string): string => {
  // Map backend condition values to display values
  const conditionMap: Record<string, string> = {
    NEW: "New",
    USED: "Used",
    new: "New",
    used: "Used",
  };
  return conditionMap[condition] || condition;
};

const getConditionColor = (condition: string): ConditionColorType => {
  // Map backend condition values to colors
  const colorMap: Record<string, ConditionColorType> = {
    NEW: "success",
    USED: "secondary",
    new: "success",
    used: "secondary",
  };
  return colorMap[condition] || "secondary";
};

// Helper function to format milliseconds to readable time (hours and minutes only)
const formatMillisecondsToReadable = (milliseconds: number): string => {
  if (isNaN(milliseconds) || milliseconds < 0) {
    return "0 minutes";
  }

  const totalMinutes = Math.floor(milliseconds / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) {
    return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
  } else if (minutes === 0) {
    return `${hours} hour${hours !== 1 ? "s" : ""}`;
  } else {
    return `${hours} hour${hours !== 1 ? "s" : ""} and ${minutes} minute${
      minutes !== 1 ? "s" : ""
    }`;
  }
};

const StatusIndicator = ({ isActive }: { isActive: boolean }) => (
  <Tooltip content={isActive ? "Monitor Active" : "Monitor Paused"}>
    <div className="relative">
      <div
        className={`w-3 h-3 rounded-full ${
          isActive
            ? "bg-[#e53238] animate-[pulse_2s_ease-in-out_infinite]"
            : "bg-gray-300"
        }`}
      />
    </div>
  </Tooltip>
);

export default function MonitorTile({
  keywords,
  excludedKeywords,
  sellers,
  isActive,
  minPrice,
  maxPrice,
  condition,
  monitorInterval,
  onToggle,
  onEdit,
  onDelete,
  onView,
}: MonitorTileProps) {
  return (
    <Card className="w-full h-full mx-auto transition-all duration-200 hover:shadow-lg">
      <CardHeader
        className={`flex justify-between gap-3 pb-2 ebay-gradient-border ${
          isActive ? "active" : "inactive"
        }`}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon
              icon={faEbay}
              className="text-dark dark:text-light text-3xl md:text-4xl md:ps-3"
            />
            <div className="h-4 w-px bg-neutral-200 mx-2" />
            <div className="flex items-center gap-2">
              <StatusIndicator isActive={isActive} />
              <p
                className={`text-md lg:text-lg font-bold ${
                  onView
                    ? "cursor-pointer hover:text-primary transition-colors"
                    : ""
                }`}
                onClick={onView}
              >
                {keywords.join(" ")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-1">
              <Tooltip content={isActive ? "Pause monitor" : "Start monitor"}>
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  color={isActive ? "secondary" : "success"}
                  onPress={onToggle}
                >
                  {isActive ? <Pause size={18} /> : <Play size={18} />}
                </Button>
              </Tooltip>
              <Tooltip content="Edit monitor">
                <Button isIconOnly size="sm" variant="light" onPress={onEdit}>
                  <Edit size={18} />
                </Button>
              </Tooltip>
              <Tooltip color="danger" content="Delete monitor">
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  color="danger"
                  onPress={onDelete}
                >
                  <Trash2 size={18} />
                </Button>
              </Tooltip>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardBody className="pt-4 lg:pt-6 sm:p-6">
        <div className="grid gap-4 text-sm lg:text-base">
          {excludedKeywords && excludedKeywords.length > 0 && (
            <div className="flex items-start gap-2">
              <OctagonMinus
                size={18}
                className="mt-1 text-default-400 flex-shrink-0"
              />
              <p className="text-default-500">
                <span className="font-semibold">Excluded:</span>{" "}
                {excludedKeywords.join(", ")}
              </p>
            </div>
          )}

          {sellers && sellers.length > 0 && (
            <div className="flex items-start gap-2">
              <Store
                size={18}
                className="mt-1 text-default-400 flex-shrink-0"
              />
              <p className="text-default-500">
                <span className="font-semibold">Seller(s):</span>{" "}
                {sellers.join(", ")}
              </p>
            </div>
          )}

          {(minPrice !== undefined && minPrice !== null) ||
          (maxPrice !== undefined && maxPrice !== null) ? (
            <div className="flex items-start gap-2">
              <HandCoins
                size={18}
                className="mt-1 text-default-400 flex-shrink-0"
              />
              <p className="text-default-500">
                <span className="font-semibold">Price:</span>{" "}
                {
                  minPrice !== undefined && minPrice !== null
                    ? maxPrice !== undefined && maxPrice !== null
                      ? `$${minPrice} - $${maxPrice}` // Both min and max set
                      : `$${minPrice}+` // Only min set
                    : `<$${maxPrice}` // Only max set
                }
              </p>
            </div>
          ) : null}

          {condition && condition.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {condition.map((cond: string) => (
                <Chip
                  key={cond}
                  size="sm"
                  variant="flat"
                  color={getConditionColor(cond)}
                  className="text-xs lg:text-sm"
                >
                  {formatCondition(cond)}
                </Chip>
              ))}
            </div>
          )}

          {monitorInterval && (
            <div className="flex items-start gap-2">
              <Clock
                size={18}
                className="mt-1 text-default-400 flex-shrink-0"
              />
              <p className="text-default-500">
                <span className="font-semibold">Check every:</span>{" "}
                {formatMillisecondsToReadable(monitorInterval)}
              </p>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
