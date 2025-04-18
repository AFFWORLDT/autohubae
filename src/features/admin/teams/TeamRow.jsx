import ConfirmDelete from "../../../ui/ConfirmDelete";
import Modal from "../../../ui/Modal";
import Table from "../../../ui/Table";
import TeamForm from "./TeamForm";
import useDeleteTeam from "./useDeleteTeam";
import { useState } from "react";

function TeamRow({ teamData, level = 0 }) {
    const { removeTeam, isPending: isDeleting } = useDeleteTeam();
    const [expandedTeams, setExpandedTeams] = useState(new Set());

    const hasSubTeamsOrMembers = (teamData.sub_teams && teamData.sub_teams.length > 0) || 
                                (teamData.members && teamData.members.length > 0);

    const toggleTeam = (teamId) => {
        setExpandedTeams(prev => {
            const newSet = new Set(prev);
            if (newSet.has(teamId)) {
                newSet.delete(teamId);
            } else {
                newSet.add(teamId);
            }
            return newSet;
        });
    };

    const isTeamExpanded = (teamId) => {
        return expandedTeams.has(teamId);
    };

    const renderTeamRow = (team, isSubTeam = false) => (
        <Table.Row key={team.team_id} style={{ 
            backgroundColor: isSubTeam ? "#f5f5f5" : "transparent",
        }}>
            <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "10px",
                paddingLeft: `${level * 40}px`
            }}>
                {(team.sub_teams?.length > 0 || team.members?.length > 0) && (
                    <button 
                        onClick={() => toggleTeam(team.team_id)}
                        style={{ 
                            background: "none",
                            border: "none",
                            cursor: "pointer"
                        }}
                    >
                        <img 
                            src={isTeamExpanded(team.team_id) ? "/icons/arrow-downn.svg" : "/icons/arrow-right.svg"} 
                            alt="toggle"
                            width="20"
                            height="20"
                        />
                    </button>
                )}
                <div style={{display: "flex", alignItems: "center", gap: "10px"}}>
                    {team.team_leader && (
                        <img 
                            src={team.team_leader.avatar} 
                            alt={team.team_leader.name}
                            style={{
                                width: "30px",
                                height: "30px",
                                borderRadius: "50%",
                                objectFit: "cover"
                            }}
                        />
                    )}
                    <span>{team.name}</span>
                </div>
            </div>
            <span style={{ textAlign: "center" }}>
                {team.members_count}
            </span>

            <Modal>
                <div className="btnsTableRow">
                    <Modal.Open openWindowName={`editTeam-${team.team_id}`}>
                        <button>
                            <img src="/icons/edit.svg" />
                            <span>Edit</span>
                        </button>
                    </Modal.Open>
                    <Modal.Open openWindowName={`deleteTeam-${team.team_id}`}>
                        <button className="btnDeleteRow">
                            <img src="/icons/delete.svg" />
                            <span>Delete</span>
                        </button>
                    </Modal.Open>
                </div>

                <Modal.Window name={`editTeam-${team.team_id}`}>
                    <TeamForm teamToEdit={team} />
                </Modal.Window>
                <Modal.Window name={`deleteTeam-${team.team_id}`}>
                    <ConfirmDelete
                        resourceName="team"
                        resourceId={team.team_id}
                        onConfirm={() => removeTeam(team.team_id)}
                        isDeleting={isDeleting}
                    />
                </Modal.Window>
            </Modal>
        </Table.Row>
    );

    const renderMembers = (members, currentLevel) => {
        return members.map(member => (
            <Table.Row key={member.id} style={{
                backgroundColor: "#f9f9f9",
                paddingLeft: `${(currentLevel + 1) * 40}px`
            }}>
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    paddingLeft: `${(currentLevel + 1) * 40}px`
                }}>
                    <img 
                        src={member.avatar}
                        alt={member.name}
                        style={{
                            width: "30px",
                            height: "30px",
                            borderRadius: "50%",
                            objectFit: "cover"
                        }}
                    />
                    <span>{member.name}</span>
                </div>
                <span style={{ textAlign: "center" }}>-</span>
                <span></span>
            </Table.Row>
        ));
    };

    const renderSubTeams = (subTeams, currentLevel) => {
        return subTeams.map(subTeam => (
            <div key={subTeam.team_id}>
                {renderTeamRow(subTeam, true)}
                {isTeamExpanded(subTeam.team_id) && (
                    <>
                        {subTeam.members?.length > 0 && renderMembers(subTeam.members, currentLevel)}
                        {subTeam.sub_teams?.length > 0 && renderSubTeams(subTeam.sub_teams, currentLevel + 1)}
                    </>
                )}
            </div>
        ));
    };

    return (
        <>
            {renderTeamRow(teamData)}
            {isTeamExpanded(teamData.team_id) && (
                <>
                    {teamData.members?.length > 0 && renderMembers(teamData.members, level)}
                    {teamData.sub_teams?.length > 0 && renderSubTeams(teamData.sub_teams, level + 1)}
                </>
            )}
        </>
    );
}

export default TeamRow;
