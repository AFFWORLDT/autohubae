import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { bulkAssignedAreas } from "../../services/apiAreas";

function useAssignBulkAgentToArea() {
    const queryClient = useQueryClient();

    const { mutate: assignAgents, isPending } = useMutation({
        mutationFn: ({ area_ids, new_agent_id }) =>
            bulkAssignedAreas({ area_ids, new_agent_id }),
        onSuccess: () => {
            toast.success("Agents assigned successfully!");
            queryClient.invalidateQueries({ queryKey: ["areas"] });
            queryClient.invalidateQueries({ queryKey: ["areasWithoutCount"] });
        },
        onError: (err) => toast.error(err.message),
    });

    return { assignAgents, isPending };
}

export default useAssignBulkAgentToArea;
