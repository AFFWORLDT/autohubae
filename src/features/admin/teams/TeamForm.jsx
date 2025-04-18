import { useForm } from "react-hook-form";
import styles from "../../../styles/FormGrid.module.css";
import useCreateTeam from "./useCreateTeam";
import useUpdateTeam from "./useUpdateTeam";
import useStaff from "../staff/useStaff";
import FormInputDataList from "../../../ui/FormInputDataList";
import { useEffect, useState } from "react";
import axios from "axios";
import { getApiUrl } from "../../../utils/getApiUrl";

function TeamForm({ onCloseModal, teamToEdit = {} }) {
    const isEditSession = teamToEdit.team_id ? true : false;
    const BACKEND_URL = getApiUrl();
    
    const { register, handleSubmit, control } = useForm({
        defaultValues: isEditSession
            ? {
                  ...teamToEdit,
                  team_leader_id: {
                      label: teamToEdit.team_leader_name,
                      value: teamToEdit.team_leader_id,
                  },
                  parent_team_id: {
                      label: teamToEdit.parent_team_name,
                      value: teamToEdit.parent_team_id,
                  }
              }
            : {},
    });

    const [teams, setTeams] = useState([]);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/api/all_teams`);
                setTeams(response.data);
            } catch (error) {
                console.error("Error fetching teams:", error);
            }
        };
        fetchTeams();
    }, []);

    const teamOptions = teams.map((team) => {
        return { 
            value: team.team_id, 
            label: `${team.name} ${team.team_leader_name ? `(Leader: ${team.team_leader_name})` : ''}`
        };
    });

    const { addTeam, isPending: isCreating } = useCreateTeam();
    const { changeTeam, isPending: isUpdating } = useUpdateTeam();
    const isWorking = isCreating || isUpdating;

    const { data: staffData, isLoading: isLoadingStaff } = useStaff();

    const staffOptions = staffData.map((item) => {
        return { value: item.id, label: item.name };
    });

    function onSubmit(data) {
        data.team_leader_id = data.team_leader_id.value;
        data.parent_team_id = data.parent_team_id?.value || null;

        isEditSession
            ? changeTeam(
                  {
                      id: teamToEdit.team_id,
                      payload: data,
                  },
                  {
                      onSettled: onCloseModal,
                  }
              )
            : addTeam(data, {
                  onSettled: onCloseModal,
              });
    }

    return (
        <form 
            className={styles.formGrid} 
            onSubmit={handleSubmit(onSubmit)}
            style={{
                width: '100%',
                maxWidth: '800px',
                margin: '0 auto',
                padding: '2rem',
                backgroundColor: '#fff',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
        >
            <h3 style={{
                fontSize: '2rem',
                textAlign: 'center',
                color: '#0369a1',
                marginBottom: '2rem'
            }}>
                {isEditSession ? 'Edit Team' : 'Create New Team'}
            </h3>

            <div className={styles.formContainer} style={{
                display: 'grid',
                gap: '2rem',
                width: '100%'
            }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                }}>
                    <label style={{
                        fontSize: '1.1rem',
                        fontWeight: '500',
                        color: '#374151'
                    }}>Team Name</label>
                    <input 
                        type="text" 
                        required 
                        {...register("name")}
                        style={{
                            padding: '0.75rem',
                            borderRadius: '8px',
                            border: '1px solid #d1d5db',
                            fontSize: '1rem',
                            width: '100%'
                        }}
                        placeholder="Enter team name"
                    />
                </div>

                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                }}>
                    <label style={{
                        fontSize: '1.1rem',
                        fontWeight: '500',
                        color: '#374151'
                    }}>Team Leader</label>
                    <FormInputDataList
                        control={control}
                        registerName={"team_leader_id"}
                        data={staffOptions}
                        isLoading={isLoadingStaff}
                        required={true}
                        placeholder="Select Team Leader"
                        styles={{
                            control: (base) => ({
                                ...base,
                                padding: '0.25rem',
                                borderRadius: '8px',
                                minHeight: '45px'
                            })
                        }}
                    />
                </div>

                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                }}>
                    <label style={{
                        fontSize: '1.1rem',
                        fontWeight: '500',
                        color: '#374151'
                    }}>Parent Team</label>
                    <FormInputDataList
                        control={control}
                        registerName={"parent_team_id"}
                        data={teamOptions}
                        isLoading={false}
                        required={false}
                        placeholder="Select Parent Team"
                        styles={{
                            control: (base) => ({
                                ...base,
                                padding: '0.25rem',
                                borderRadius: '8px',
                                minHeight: '45px'
                            })
                        }}
                    />
                </div>

                <div style={{
                    display: 'flex',
                    gap: '1rem',
                    justifyContent: 'flex-end',
                    marginTop: '1rem',
                    flexWrap: 'wrap'
                }}>
                    <button
                        onClick={onCloseModal}
                        type="button"
                        disabled={isWorking}
                        style={{
                            padding: '0.75rem 1.5rem',
                            borderRadius: '8px',
                            border: '1px solid #d1d5db',
                            backgroundColor: '#fff',
                            color: '#374151',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            flex: '1',
                            minWidth: '120px',
                            maxWidth: '200px'
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isWorking}
                        style={{
                            padding: '0.75rem 1.5rem',
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: '#0369a1',
                            color: '#fff',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            flex: '1',
                            minWidth: '120px',
                            maxWidth: '200px',
                            ':hover': {
                                backgroundColor: '#0284c7'
                            }
                        }}
                    >
                        {isWorking ? "Processing..." : "Submit"}
                    </button>
                </div>
            </div>
        </form>
    );
}

export default TeamForm;
