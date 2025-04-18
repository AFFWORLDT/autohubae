import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { saveContractInfo } from "../../services/apiContract"; 

function useSaveTanance() {
    const queryClient = useQueryClient();

    const { mutate: saveTanance, isPending } = useMutation({
        mutationFn: saveContractInfo,
        onSuccess: () => {
            toast.success("Save Successfully!");
            queryClient.invalidateQueries({ queryKey: ["tanance"] });
        },
        onError: (err) =>{  
            toast.error(err.responce?.data?.message)
        } 
    });

    return { saveTanance, isPending };
}

export default useSaveTanance;
