import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
interface InfoTooltipProps {
    content: string;
}
const InfoTooltip: React.FC<InfoTooltipProps> = ({ content }) => {
    return (
        <TooltipProvider>
            <Tooltip delayDuration={300}>
                <TooltipTrigger className="ml-1">
                    <Info className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                    <p className="text-sm">{content}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};
export default InfoTooltip;