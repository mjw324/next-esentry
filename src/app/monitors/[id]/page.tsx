"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Slider,
  Spacer,
  Tooltip,
} from "@heroui/react";
import type { SliderValue } from "@heroui/react";
import {
  Play,
  Pause,
  Edit,
  Save,
  X,
  Trash2,
  ArrowLeft,
  ShoppingBag,
  HandCoins,
  Store,
} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEbay } from "@fortawesome/free-brands-svg-icons";
import { useMonitors, type Monitor } from "@/contexts/MonitorContext";
import { addToast } from "@heroui/toast";

// Import the form components from the modal
import PriceRangeSlider from "@/components/dashboard/ebaymonitorsetup/PriceRangeSlider";
import ChipInput from "@/components/dashboard/ebaymonitorsetup/ChipInput";
import ConditionCheckboxGroup from "@/components/dashboard/ebaymonitorsetup/ConditionCheckboxGroup";

type ConditionColorType = "success" | "warning" | "secondary";

const formatCondition = (condition: string): string => {
  const conditionMap: Record<string, string> = {
    NEW: "New",
    USED: "Used",
    new: "New",
    used: "Used",
  };
  return conditionMap[condition] || condition;
};

const getConditionColor = (condition: string): ConditionColorType => {
  const colorMap: Record<string, ConditionColorType> = {
    NEW: "success",
    USED: "secondary",
    new: "success",
    used: "secondary",
  };
  return colorMap[condition] || "secondary";
};

interface MonitorData {
  keywords: string[];
  excludedKeywords?: string[];
  condition?: string[];
  sellers?: string[];
  minPrice?: number;
  maxPrice?: number;
  monitorInterval?: number;
}

const StatusIndicator = ({ isActive }: { isActive: boolean }) => (
  <Tooltip content={isActive ? "Monitor Active" : "Monitor Paused"}>
    <div className="relative">
      <div
        className={`w-4 h-4 rounded-full ${
          isActive
            ? "bg-[#e53238] animate-[pulse_2s_ease-in-out_infinite]"
            : "bg-gray-300"
        }`}
      />
    </div>
  </Tooltip>
);

export default function MonitorPage() {
  const params = useParams();
  const router = useRouter();
  const { monitors, updateMonitor, deleteMonitor, toggleMonitor, loading } = useMonitors();

  const monitorId = params.id as string;
  const monitor = monitors.find((m) => m.id === monitorId);

  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state for editing
  const [keywords, setKeywords] = useState<string[]>([]);
  const [excludedKeywords, setExcludedKeywords] = useState<string[]>([]);
  const [condition, setCondition] = useState<string[]>([]);
  const [sellers, setSellers] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number | undefined, number | undefined]>([undefined, undefined]);
  const [monitorInterval, setMonitorInterval] = useState<number>(7200000);

  // Validation state
  const [keywordError, setKeywordError] = useState<string>("");
  const [duplicateError, setDuplicateError] = useState<string>("");

  // Helper function to format milliseconds to HH:MM:SS
  const formatMillisecondsToHHMMSS = (milliseconds: number) => {
    if (isNaN(milliseconds) || milliseconds < 0) {
      return "00:00:00";
    }

    let totalSeconds = Math.floor(milliseconds / 1000);
    let hours = Math.floor(totalSeconds / 3600);

    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;

    const pad = (num: number) => String(num).padStart(2, "0");

    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  // Initialize form when monitor loads or editing starts
  useEffect(() => {
    if (monitor && isEditing) {
      setKeywords(monitor.keywords || []);
      setExcludedKeywords(monitor.excludedKeywords || []);
      setCondition(monitor.condition || []);
      setSellers(monitor.sellers || []);
      setPriceRange([monitor.minPrice, monitor.maxPrice]);
      setMonitorInterval(monitor.monitorInterval || 7200000);
      setKeywordError("");
      setDuplicateError("");
    }
  }, [monitor, isEditing]);

  const validateMonitor = (): boolean => {
    let isValid = true;

    if (keywords.length === 0) {
      setKeywordError("At least one keyword is required");
      isValid = false;
    } else {
      setKeywordError("");
    }

    const duplicates = keywords.filter((keyword) =>
      excludedKeywords.includes(keyword)
    );

    if (duplicates.length > 0) {
      setDuplicateError(
        `Cannot have same keywords in both lists: ${duplicates.join(", ")}`
      );
      isValid = false;
    } else {
      setDuplicateError("");
    }

    return isValid;
  };

  const handleSave = async () => {
    if (!validateMonitor()) return;

    setIsSubmitting(true);
    try {
      const monitorData: Partial<Monitor> = {
        keywords,
        excludedKeywords,
        condition,
        sellers,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        monitorInterval,
      };

      await updateMonitor(monitorId, monitorData);
      setIsEditing(false);
    } catch (error) {
      // Error handling is done in the context
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggle = async () => {
    try {
      await toggleMonitor(monitorId);
    } catch (error) {
      // Error handling is done in the context
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this monitor?")) {
      try {
        await deleteMonitor(monitorId);
        router.push("/dashboard");
      } catch (error) {
        // Error handling is done in the context
      }
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setKeywordError("");
    setDuplicateError("");
  };

  if (loading && !monitor) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading monitor...</div>
        </div>
      </div>
    );
  }

  if (!monitor) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="flex items-center justify-center h-64 flex-col gap-4">
          <div className="text-lg text-default-500">Monitor not found</div>
          <Button
            variant="flat"
            startContent={<ArrowLeft size={18} />}
            onPress={() => router.push("/dashboard")}
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            isIconOnly
            variant="light"
            onPress={() => router.push("/dashboard")}
          >
            <ArrowLeft size={20} />
          </Button>
          <div className="flex items-center gap-3">
            <FontAwesomeIcon
              icon={faEbay}
              className="text-dark dark:text-light text-3xl"
            />
            <div className="h-6 w-px bg-neutral-200 dark:bg-neutral-700" />
            <div className="flex items-center gap-3">
              <StatusIndicator isActive={monitor.isActive} />
              <h1 className="text-2xl font-bold">
                {monitor.keywords.join(" ")}
              </h1>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isEditing ? (
            <>
              <Tooltip content={monitor.isActive ? "Pause monitor" : "Start monitor"}>
                <Button
                  isIconOnly
                  variant="flat"
                  color={monitor.isActive ? "secondary" : "success"}
                  onPress={handleToggle}
                  isDisabled={loading}
                >
                  {monitor.isActive ? <Pause size={18} /> : <Play size={18} />}
                </Button>
              </Tooltip>
              <Tooltip content="Edit monitor">
                <Button
                  isIconOnly
                  variant="flat"
                  onPress={() => setIsEditing(true)}
                >
                  <Edit size={18} />
                </Button>
              </Tooltip>
              <Tooltip color="danger" content="Delete monitor">
                <Button
                  isIconOnly
                  variant="flat"
                  color="danger"
                  onPress={handleDelete}
                  isDisabled={loading}
                >
                  <Trash2 size={18} />
                </Button>
              </Tooltip>
            </>
          ) : (
            <>
              <Button
                variant="flat"
                startContent={<X size={18} />}
                onPress={handleCancelEdit}
                isDisabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                color="success"
                variant="flat"
                startContent={<Save size={18} />}
                onPress={handleSave}
                isLoading={isSubmitting}
                isDisabled={isSubmitting}
              >
                Save Changes
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <Card className="w-full">
        <CardHeader className={`ebay-gradient-border ${monitor.isActive ? "active" : "inactive"}`}>
          <h2 className="text-lg font-semibold">
            {isEditing ? "Edit Monitor" : "Monitor Details"}
          </h2>
        </CardHeader>

        <CardBody className="p-6">
          {isEditing ? (
            /* Edit Mode */
            <div className="space-y-6">
              <ChipInput
                label="Keywords"
                values={keywords}
                setValues={setKeywords}
                error={keywordError}
                chipColor="success"
              />

              <Divider />

              <ChipInput
                label="Excluded Keywords"
                values={excludedKeywords}
                setValues={setExcludedKeywords}
                error={duplicateError}
                chipColor="danger"
              />

              <Divider />

              <PriceRangeSlider value={priceRange} onChange={setPriceRange} />

              <Divider />

              <ConditionCheckboxGroup
                condition={condition}
                setCondition={setCondition}
              />

              <Divider />

              <ChipInput
                label="Seller(s)"
                values={sellers}
                setValues={setSellers}
                chipColor="primary"
              />

              <Divider />

              <Slider
                hideValue
                showTooltip
                value={monitorInterval}
                onChange={(value: SliderValue) => setMonitorInterval(value as number)}
                getTooltipValue={(value: SliderValue) => formatMillisecondsToHHMMSS(value as number)}
                label="Monitor Interval (hh:mm:ss)"
                minValue={300000} // 5 minutes in milliseconds
                maxValue={86400000} // 24 hours in milliseconds
                step={300000} // 5-minute steps
                className="w-full"
              />
            </div>
          ) : (
            /* View Mode */
            <div className="space-y-6">
              {/* Keywords */}
              <div>
                <h3 className="text-md font-semibold mb-3 text-success">Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {monitor.keywords.map((keyword) => (
                    <Chip key={keyword} color="success" variant="flat">
                      {keyword}
                    </Chip>
                  ))}
                </div>
              </div>

              {/* Excluded Keywords */}
              {monitor.excludedKeywords && monitor.excludedKeywords.length > 0 && (
                <>
                  <Divider />
                  <div className="flex items-start gap-3">
                    <ShoppingBag size={20} className="mt-1 text-default-400" />
                    <div>
                      <h3 className="text-md font-semibold mb-3">Excluded Keywords</h3>
                      <div className="flex flex-wrap gap-2">
                        {monitor.excludedKeywords.map((keyword) => (
                          <Chip key={keyword} color="danger" variant="flat">
                            {keyword}
                          </Chip>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Price Range */}
              {((monitor.minPrice !== undefined && monitor.minPrice !== null) ||
                (monitor.maxPrice !== undefined && monitor.maxPrice !== null)) && (
                <>
                  <Divider />
                  <div className="flex items-start gap-3">
                    <HandCoins size={20} className="mt-1 text-default-400" />
                    <div>
                      <h3 className="text-md font-semibold mb-2">Price Range</h3>
                      <p className="text-default-600">
                        {monitor.minPrice !== undefined && monitor.minPrice !== null
                          ? monitor.maxPrice !== undefined && monitor.maxPrice !== null
                            ? `$${monitor.minPrice} - $${monitor.maxPrice}`
                            : `$${monitor.minPrice}+`
                          : `<$${monitor.maxPrice}`
                        }
                      </p>
                    </div>
                  </div>
                </>
              )}

              {/* Condition */}
              {monitor.condition && monitor.condition.length > 0 && (
                <>
                  <Divider />
                  <div>
                    <h3 className="text-md font-semibold mb-3">Condition</h3>
                    <div className="flex flex-wrap gap-2">
                      {monitor.condition.map((cond: string) => (
                        <Chip
                          key={cond}
                          variant="flat"
                          color={getConditionColor(cond)}
                        >
                          {formatCondition(cond)}
                        </Chip>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Sellers */}
              {monitor.sellers && monitor.sellers.length > 0 && (
                <>
                  <Divider />
                  <div className="flex items-start gap-3">
                    <Store size={20} className="mt-1 text-default-400" />
                    <div>
                      <h3 className="text-md font-semibold mb-3">Sellers</h3>
                      <div className="flex flex-wrap gap-2">
                        {monitor.sellers.map((seller) => (
                          <Chip key={seller} color="primary" variant="flat">
                            {seller}
                          </Chip>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Monitor Interval */}
              {monitor.monitorInterval && (
                <>
                  <Divider />
                  <div>
                    <h3 className="text-md font-semibold mb-2">Monitor Interval</h3>
                    <p className="text-default-600">
                      Check every {formatMillisecondsToHHMMSS(monitor.monitorInterval)}
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}